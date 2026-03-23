const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const ProductVariant = require("../../models/ProductVariant");
const User = require("../../models/User");
const logger = require("../../utils/logger");
const { initializeTransaction } = require("../../utils/chapaClient");
const {
  deductStockForOrderItems,
  fulfillChapaOrderByTxRef,
} = require("../../utils/chapaOrderFulfillment");

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

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

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

      const { first_name, last_name } = splitName(shippingAddress.fullName);
      const currency = process.env.CHAPA_CURRENCY || "ETB";
      const backendPublic =
        process.env.BACKEND_PUBLIC_URL ||
        process.env.API_PUBLIC_URL ||
        `http://localhost:${process.env.PORT || 5000}`;
      const frontend = process.env.FRONTEND_URL || "http://localhost:3000";

      const callbackUrl = `${backendPublic.replace(/\/$/, "")}/api/chapa/callback`;
      const txRef = pending.paymentInfo.chapaTxRef;
      const returnUrl = `${frontend.replace(/\/$/, "")}/users/orders/payment/chapa?tx_ref=${encodeURIComponent(txRef)}`;

      const payload = {
        amount: String(Number(totalAmount).toFixed(2)),
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
          description: `Order ${pending._id}`,
        },
      };

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

    for (const item of orderItems) {
      if (item.variant) {
        await ProductVariant.findByIdAndUpdate(item.variant, {
          $inc: { stock: -item.quantity },
        });
      } else {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: paymentMethod === "cash_on_delivery" ? "pending" : "pending",
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
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
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
    console.error("Get My Orders Error:", error);
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
    console.error("Get Order By ID Error:", error);
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
    console.error("Order Stats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  createOrder,
  verifyChapaPayment,
  getMyOrders,
  getOrderById,
  orderStats,
};
