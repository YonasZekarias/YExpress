const CHAPA_BASE = "https://api.chapa.co/v1";

function getSecret() {
  const key = process.env.CHAPA_SECRET_KEY;
  if (!key) throw new Error("CHAPA_SECRET_KEY is not configured");
  return key;
}

/**
 * @param {object} payload - Chapa initialize body (amount as string, currency, email, etc.)
 */
async function initializeTransaction(payload) {
  const secret = getSecret();
  const res = await fetch(`${CHAPA_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.message || data.msg || res.statusText || "Chapa initialize failed";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  if (data.status !== "success" || !data.data?.checkout_url) {
    throw new Error(data.message || "Chapa did not return a checkout URL");
  }
  return data;
}

/**
 * @param {string} txRef - Same tx_ref used when initializing
 */
async function verifyTransaction(txRef) {
  const secret = getSecret();
  const url = `${CHAPA_BASE}/transaction/verify/${encodeURIComponent(txRef)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

module.exports = { initializeTransaction, verifyTransaction, CHAPA_BASE };
