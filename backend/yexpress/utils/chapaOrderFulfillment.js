const Order = require("../models/Order");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const { verifyTransaction } = require("./chapaClient");
const logger = require("./logger");

async function deductStockForOrderItems(items) {
  for (const item of items) {
    if (item.variant) {
      const u = await ProductVariant.findOneAndUpdate(
        { _id: item.variant, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!u) {
        throw new Error(`Insufficient variant stock: ${item.variant}`);
      }
    } else {
      const u = await Product.findOneAndUpdate(
        {
          _id: item.product,
          $expr: {
            $gte: [{ $ifNull: ["$stock", 0] }, item.quantity],
          },
        },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!u) {
        throw new Error(`Insufficient product stock: ${item.product}`);
      }
    }
  }
}

/**
 * Verifies with Chapa and marks order paid + deducts stock (idempotent).
 * @param {string} txRef
 * @param {{ userId?: object }} [opts] - if userId set, order must belong to that user
 * @returns {{ ok: boolean, order?: object, reason?: string }}
 */
async function fulfillChapaOrderByTxRef(txRef, opts = {}) {
  if (!txRef || typeof txRef !== "string") {
    return { ok: false, reason: "missing_tx_ref" };
  }

  const order = await Order.findOne({ "paymentInfo.chapaTxRef": txRef.trim() });
  if (!order) {
    return { ok: false, reason: "order_not_found" };
  }

  if (opts.userId && order.user.toString() !== opts.userId.toString()) {
    return { ok: false, reason: "forbidden", order };
  }

  if (order.isPaid && order.paymentInfo?.status === "paid") {
    return { ok: true, order, reason: "already_paid" };
  }

  const { ok, data } = await verifyTransaction(txRef);
  if (!ok) {
    logger.warn("Chapa verify HTTP error", { txRef, data });
    return { ok: false, reason: "verify_http_error", order };
  }

  const inner = data?.data !== undefined ? data.data : data;
  const payStatus =
    (typeof inner === "object" && inner?.status) ||
    data?.status ||
    (typeof data?.data === "object" && data.data?.status);

  const success =
    payStatus === "success" ||
    data?.status === "success" ||
    (typeof inner === "object" && inner?.status === "success");

  if (!success) {
    await Order.findByIdAndUpdate(order._id, {
      "paymentInfo.status": "failed",
    });
    return { ok: false, reason: "payment_not_successful", order };
  }

  const refId =
    (typeof inner === "object" && inner?.reference) ||
    data?.data?.reference ||
    inner?.tx_ref ||
    data?.data?.id;

  const txId = refId ? String(refId) : order.paymentInfo.transactionId;

  const locked = await Order.findOneAndUpdate(
    {
      _id: order._id,
      isPaid: false,
      "paymentInfo.method": "chapa",
    },
    {
      $set: {
        isPaid: true,
        paidAt: new Date(),
        orderStatus: "processing",
        "paymentInfo.status": "paid",
        ...(txId ? { "paymentInfo.transactionId": txId } : {}),
      },
    },
    { new: true }
  );

  if (!locked) {
    const fresh = await Order.findById(order._id);
    if (fresh?.isPaid) {
      return { ok: true, order: fresh, reason: "already_paid" };
    }
    return { ok: false, reason: "lock_failed", order: fresh };
  }

  try {
    await deductStockForOrderItems(locked.items);
  } catch (deductErr) {
    logger.error("Chapa fulfill: stock deduct failed after lock", deductErr);
    await Order.findByIdAndUpdate(locked._id, {
      $set: {
        isPaid: false,
        paidAt: null,
        orderStatus: "pending",
        "paymentInfo.status": "pending",
      },
    });
    return { ok: false, reason: "stock_deduct_failed", order: locked };
  }

  return { ok: true, order: locked };
}

module.exports = {
  deductStockForOrderItems,
  fulfillChapaOrderByTxRef,
};
