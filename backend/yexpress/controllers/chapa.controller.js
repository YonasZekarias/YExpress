const { fulfillChapaOrderByTxRef } = require("../utils/chapaOrderFulfillment");
const logger = require("../utils/logger");

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";

/**
 * Chapa server-to-server callback (configure this URL in Chapa dashboard as callback_url).
 * Handles GET query params per Chapa docs (trx_ref, ref_id, status).
 */
const chapaCallback = async (req, res) => {
  try {
    const trx_ref =
      req.query.trx_ref ||
      req.query.tx_ref ||
      req.body?.trx_ref ||
      req.body?.tx_ref;

    if (trx_ref) {
      await fulfillChapaOrderByTxRef(String(trx_ref));
    }

    const redirect = `${FRONTEND}/users/orders/payment/chapa${trx_ref ? `?tx_ref=${encodeURIComponent(String(trx_ref))}` : ""}`;
    return res.redirect(302, redirect);
  } catch (err) {
    logger.error("Chapa callback error:", err);
    return res.redirect(302, `${FRONTEND}/users/orders?payment=error`);
  }
};

module.exports = { chapaCallback };
