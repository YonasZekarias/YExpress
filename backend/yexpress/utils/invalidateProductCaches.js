const logger = require("./logger");

/**
 * @param {import('redis').RedisClientType} redisClient
 */
async function invalidateProductListCaches(redisClient) {
  if (!redisClient?.scanIterator) return;
  try {
    for await (const key of redisClient.scanIterator({
      MATCH: "products:list:*",
      COUNT: 200,
    })) {
      await redisClient.del(key);
    }
  } catch (err) {
    logger.error("invalidateProductListCaches:", err);
  }
}

/**
 * @param {import('redis').RedisClientType} redisClient
 * @param {string} productId
 */
async function invalidateProductDetailCaches(redisClient, productId) {
  if (!redisClient?.scanIterator || !productId) return;
  const suffix = String(productId);
  try {
    for await (const key of redisClient.scanIterator({
      MATCH: `product:detail:*:${suffix}`,
      COUNT: 200,
    })) {
      await redisClient.del(key);
    }
  } catch (err) {
    logger.error("invalidateProductDetailCaches:", err);
  }
}

/**
 * Call after admin product create/update/delete so storefront cache stays fresh.
 * @param {import('redis').RedisClientType} redisClient
 * @param {{ productId?: string }} [opts]
 */
async function invalidateAfterProductMutation(redisClient, opts = {}) {
  await invalidateProductListCaches(redisClient);
  if (opts.productId) {
    await invalidateProductDetailCaches(redisClient, opts.productId);
  }
}

module.exports = {
  invalidateProductListCaches,
  invalidateProductDetailCaches,
  invalidateAfterProductMutation,
};
