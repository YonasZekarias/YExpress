const { createClient } = require('redis');
const logger = require('./logger')
const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
  await redisClient.connect();
}

connectRedis().then(() =>logger.info("redis connected successfully")
).catch((err) => logger.error("Redis connection error", err));



module.exports = redisClient;
