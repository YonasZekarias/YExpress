const mongoose = require("mongoose");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const ProductVariant = require("../../models/ProductVariant");
const User = require("../../models/User");
const logger = require("../../utils/logger");
const { initializeTransaction } = require("../../utils/chapaClient");
const { fulfillChapaOrderByTxRef } = require("../../utils/chapaOrderFulfillment");

/**
 * @returns {Promise<{ orderItems: any[], totalAmount: number, cart: object } | { error: { status: number, message: string } }>}
 */
async function compileCartToOrderItems(userId) {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    return { error: { status: 400, message: "Your cart is empty" } };
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    let product;
    let variant;
    let currentStock = 0;
    let priceToUse = item.price;

    if (item.variant) {
      variant = await ProductVariant.findById(item.variant);
      if (!variant) {
        return {
          error: {
            status: 404,
            message: `Variant for product ${item.product} not found`,
          },
        };
      }
      currentStock = variant.stock;
      priceToUse = variant.price;
    } else {
      product = await Product.findById(item.product);
      if (!product) {
        return { error: { status: 404, message: "Product not found" } };
      }
      currentStock = Number.isFinite(product.stock) ? product.stock : 0;
      priceToUse = product.price;
    }

    if (currentStock < item.quantity) {
      return {
        error: {
          status: 400,
          message: `Out of stock: "${product?.name || "Item"}" only has ${currentStock} left.`,
        },
      };
    }

    orderItems.push({
      product: item.product,
      variant: item.variant || null,
      quantity: item.quantity,
      price: priceToUse,
    });

    totalAmount += priceToUse * item.quantity;
  }

  return { orderItems, totalAmount, cart };
}

/**
 * Atomic stock decrement with rollback list (no replica-set transaction required).
 */
async function decrementStocksForCheckout(orderItems) {
  const reverts = [];
  for (const item of orderItems) {
    let updated;
    if (item.variant) {
      updated = await ProductVariant.findOneAndUpdate(
        { _id: item.variant, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    } else {
      updated = await Product.findOneAndUpdate(
        {
          _id: item.product,
          $expr: {
            $gte: [{ $ifNull: ["$stock", 0] }, item.quantity],
          },
        },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }
    if (!updated) {
      for (const fn of reverts.reverse()) {
        try {
          await fn();
        } catch (_) {}
      }
      return {
        ok: false,
        message:
          "An item in your cart is no longer available in that quantity.",
      };
    }
    if (item.variant) {
      reverts.push(() =>
        ProductVariant.findByIdAndUpdate(item.variant, {
          $inc: { stock: item.quantity },
        })
      );
    } else {
      reverts.push(() =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        })
      );
    }
  }
  return { ok: true, reverts };
}

function formatPhoneForChapa(phone) {
  if (!phone || typeof phone !== "string") return "0900000000";
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return digits.padStart(10, "0");
}

function splitName(fullName) {
  const parts = String(fullName || "Customer")
    .trim()
    .split(/\s+/);
  const first = parts[0] || "Customer";
  const last = parts.slice(1).join(" ") || "Customer";
  return { first_name: first, last_name: last };
}

function buildChapaUrls() {
  const backendPublic =
    process.env.BACKEND_PUBLIC_URL ||
    process.env.API_PUBLIC_URL ||
    `http://localhost:${process.env.PORT || 5000}`;
  const frontend = process.env.FRONTEND_URL || "http://localhost:3000";
  return {
    backendPublic: backendPublic.replace(/\/$/, ""),
    frontend: frontend.replace(/\/$/, ""),
  };
}

function buildChapaInitializePayload({
  order,
  user,
  shippingAddress,
  txRef,
}) {
  const { first_name, last_name } = splitName(shippingAddress.fullName);
  const currency = process.env.CHAPA_CURRENCY || "ETB";
  const { backendPublic, frontend } = buildChapaUrls();
  const callbackUrl = `${backendPublic}/api/chapa/callback`;
  const returnUrl = `${frontend}/users/orders/payment/chapa?tx_ref=${encodeURIComponent(txRef)}`;

  return {
    amount: String(Number(order.totalAmount).toFixed(2)),
    currency,
    email: user.email,
    first_name,
    last_name,
    phone_number: formatPhoneForChapa(shippingAddress.phone),
    tx_ref: txRef,
    callback_url: callbackUrl,
    return_url: returnUrl,
    customization: {
      title: process.env.CHAPA_CHECKOUT_TITLE || "YExpress order",
      description: `Order ${order._id}`,
    },
  };
}

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    if (paymentMethod === "card") {
      return res.status(501).json({
        success: false,
        message: "Card payments are not enabled. Use Chapa or cash on delivery.",
      });
    }

    const compiled = await compileCartToOrderItems(userId);
    if (compiled.error) {
      return res
        .status(compiled.error.status)
        .json({ success: false, message: compiled.error.message });
    }

    const { orderItems, totalAmount } = compiled;

    if (paymentMethod === "chapa") {
      if (!process.env.CHAPA_SECRET_KEY) {
        return res.status(503).json({
          success: false,
          message: "Chapa payments are not configured on the server",
        });
      }

      const pending = new Order({
        user: userId,
        items: orderItems,
        shippingAddress,
        paymentInfo: {
          method: "chapa",
          status: "pending",
        },
        totalAmount,
        orderStatus: "pending",
      });

      await pending.save();
      pending.paymentInfo.chapaTxRef = `yexpress-${pending._id}`;
      pending.markModified("paymentInfo");
      await pending.save();

      const user = await User.findById(userId).lean();
      if (!user?.email) {
        await Order.findByIdAndDelete(pending._id);
        return res.status(400).json({
          success: false,
          message: "Your account needs an email address to pay with Chapa",
        });
      }

      const payload = buildChapaInitializePayload({
        order: pending,
        user,
        shippingAddress,
        txRef: pending.paymentInfo.chapaTxRef,
      });

      try {
        const init = await initializeTransaction(payload);
        const checkoutUrl = init.data.checkout_url;
        await Cart.findOneAndDelete({ user: userId });
        return res.status(201).json({
          success: true,
          message: "Redirect to Chapa to complete payment",
          data: pending,
          checkoutUrl,
        });
      } catch (err) {
        logger.error("Chapa initialize failed:", err);
        await Order.findByIdAndDelete(pending._id);
        return res.status(502).json({
          success: false,
          message: err.message || "Could not start Chapa checkout",
        });
      }
    }

    const dec = await decrementStocksForCheckout(orderItems);
    if (!dec.ok) {
      return res.status(400).json({ success: false, message: dec.message });
    }

    try {
      const order = new Order({
        user: userId,
        items: orderItems,
        shippingAddress,
        paymentInfo: {
          method: paymentMethod,
          status: "pending",
        },
        totalAmount,
        orderStatus: "pending",
      });

      const createdOrder = await order.save();
      await Cart.findOneAndDelete({ user: userId });

      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: createdOrder,
      });
    } catch (saveErr) {
      for (const fn of dec.reverts.reverse()) {
        try {
          await fn();
        } catch (_) {}
      }
      throw saveErr;
    }
  } catch (error) {
    logger.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

async function buildChapaResumeResponse(order, userId) {
  if (!order) {
    return { status: 404, body: { success: false, message: "Order not found" } };
  }
  if (order.paymentInfo?.method !== "chapa") {
    return {
      status: 400,
      body: { success: false, message: "This order does not use Chapa" },
    };
  }
  if (order.isPaid) {
    return {
      status: 400,
      body: { success: false, message: "This order is already paid" },
    };
  }
  if (!process.env.CHAPA_SECRET_KEY) {
    return {
      status: 503,
      body: {
        success: false,
        message: "Chapa payments are not configured on the server",
      },
    };
  }

  const txRef = order.paymentInfo?.chapaTxRef;
  if (!txRef) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Missing Chapa reference on this order",
      },
    };
  }

  const user = await User.findById(userId).lean();
  if (!user?.email) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Your account needs an email address to pay with Chapa",
      },
    };
  }

  const payload = buildChapaInitializePayload({
    order,
    user,
    shippingAddress: order.shippingAddress,
    txRef,
  });

  const init = await initializeTransaction(payload);
  return {
    status: 200,
    body: { success: true, checkoutUrl: init.data.checkout_url },
  };
}

const resumeChapaCheckout = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid order id" });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    const out = await buildChapaResumeResponse(order, req.user._id);
    return res.status(out.status).json(out.body);
  } catch (err) {
    logger.error("resumeChapaCheckout:", err);
    res.status(502).json({
      success: false,
      message: err.message || "Could not resume Chapa checkout",
    });
  }
};

const resumeChapaByTxRef = async (req, res) => {
  try {
    const { tx_ref } = req.body;
    if (!tx_ref || typeof tx_ref !== "string") {
      return res.status(400).json({ success: false, message: "tx_ref is required" });
    }

    const order = await Order.findOne({
      "paymentInfo.chapaTxRef": tx_ref.trim(),
      user: req.user._id,
    });

    const out = await buildChapaResumeResponse(order, req.user._id);
    return res.status(out.status).json(out.body);
  } catch (err) {
    logger.error("resumeChapaByTxRef:", err);
    res.status(502).json({
      success: false,
      message: err.message || "Could not resume Chapa checkout",
    });
  }
};

const verifyChapaPayment = async (req, res) => {
  try {
    const { tx_ref } = req.body;
    const result = await fulfillChapaOrderByTxRef(tx_ref, { userId: req.user._id });

    if (result.reason === "forbidden") {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }
    if (result.reason === "order_not_found" || result.reason === "missing_tx_ref") {
      return res
        .status(404)
        .json({ success: false, message: "Order not found for this payment" });
    }
    if (!result.ok) {
      return res.status(400).json({
        success: false,
        message: "Payment could not be confirmed yet",
        reason: result.reason,
      });
    }

    const fresh = await Order.findById(result.order._id);
    res.status(200).json({ success: true, data: fresh });
  } catch (error) {
    logger.error("verifyChapaPayment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { status, sort } = req.query;

    let query = { user: req.user._id };

    if (status && status !== "all") {
      query.orderStatus = status;
    }

    let sortOptions = { createdAt: -1 };

    if (sort === "oldest") {
      sortOptions = { createdAt: 1 };
    } else if (sort === "price_high") {
      sortOptions = { totalAmount: -1 };
    } else if (sort === "price_low") {
      sortOptions = { totalAmount: 1 };
    }

    const orders = await Order.find(query)
      .sort(sortOptions)
      .populate("items.product", "name photo")
      .populate({
        path: "items.variant",
        select: "attributes",
        populate: { path: "attributes.attribute", select: "name" },
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    logger.error("Get My Orders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("items.product", "name photo price")
      .populate({
        path: "items.variant",
        populate: [
          { path: "attributes.attribute", select: "name" },
          { path: "attributes.value", select: "value" },
        ],
      });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    logger.error("Get Order By ID Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const orderStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      pendingOrderCount,
      processingOrderCount,
      shippedOrderCount,
      deliveredOrderCount,
      cancelledOrderCount,
    ] = await Promise.all([
      Order.countDocuments({ user: userId, orderStatus: "pending" }),
      Order.countDocuments({ user: userId, orderStatus: "processing" }),
      Order.countDocuments({ user: userId, orderStatus: "shipped" }),
      Order.countDocuments({ user: userId, orderStatus: "delivered" }),
      Order.countDocuments({ user: userId, orderStatus: "cancelled" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        pending: pendingOrderCount,
        processing: processingOrderCount,
        shipped: shippedOrderCount,
        delivered: deliveredOrderCount,
        cancelled: cancelledOrderCount,
      },
    });
  } catch (error) {
    logger.error("Order Stats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  resumeChapaCheckout,
  resumeChapaByTxRef,
  verifyChapaPayment,
  getMyOrders,
  getOrderById,
  orderStats,
};
