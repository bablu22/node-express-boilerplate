import IORedis from 'ioredis';

import config from './app.config';
import chalk from 'chalk';

export const redisConfig = {
  host: config.REDIS.HOST || 'localhost',
  port: parseInt(config.REDIS.PORT) || 6379,
  // password: config.REDIS.PASSWORD || undefined,
};
const redisUrl = 'redis://localhost:6379';

export const redisConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

export async function validateRedisConnection() {
  const redis = new IORedis(redisConfig);

  try {
    await redis.ping();

    // Check if we can set and get a test key
    await redis.set('test-connection', 'working');
    const testValue = await redis.get('test-connection');

    if (testValue === 'working') {
      console.log(chalk.black.bgBlueBright('Redis connection is working ✅ '));
    }

    // Optional: Clean up test key
    await redis.del('test-connection');
  } catch (error) {
    console.log(chalk.white.bgRed(error || 'Error connecting to Redis'));
  } finally {
    await redis.quit();
  }
}
