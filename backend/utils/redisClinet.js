import { createClient } from 'redis';
const logger = require('./logger')
const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect();

logger.info("redis connected successfully")

export default redisClient;
