const redis = require("redis");
const logger = require("../utils/logger");
const { cli } = require("winston/lib/winston/config");

const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
  },
  
});

client.on("error", (err) => {
  logger.error(`Redis error: ${err.message}`);
});

client.on("connect", () => {
  logger.info("Redis connected successfully");
});

const connectRedis = async () => {
  try {
    await client.connect();
  } catch (err) {
    logger.error(`Redis connection error: ${err.message}`);
  }
};

module.exports = { client, connectRedis };
