const Order = require("../models/Order");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const { verifyTransaction } = require("./chapaClient");
const logger = require("./logger");

async function deductStockForOrderItems(items) {
  for (const item of items) {
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

  await deductStockForOrderItems(order.items);

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentInfo.status = "paid";
  order.paymentInfo.transactionId = refId
    ? String(refId)
    : order.paymentInfo.transactionId;
  order.orderStatus = "processing";
  await order.save();

  return { ok: true, order };
}

module.exports = {
  deductStockForOrderItems,
  fulfillChapaOrderByTxRef,
};
