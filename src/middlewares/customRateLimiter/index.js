import { createClient } from 'redis';
import { timeWindowLimiter } from './timeWindow';
import { monthlyRateLimiter } from './MonthlyRateLimit';
import { systemRateLimiter } from './systemRateLimit';

const redisClient = createClient();
redisClient.on('error', (err) => console.error('>>>>>>> Redis Client Error', err));
redisClient.on('connect', () => {
  console.log('>>>>>>>>>. Connected to Redis');
});

// 💡 this rate limiter is based on the token bucket algorithm
export const customRedisRateLimiterTokenBucket = async (req, res, next) => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  try {
    // check that redis client exists
    if (!redisClient) {
      throw new Error('Redis client does not exist!');
    }

    await timeWindowLimiter(req, res, redisClient);
    await monthlyRateLimiter(req, res, redisClient);
    await systemRateLimiter({ res, redisClient });

    next();
  } catch (error) {
    console.log('***** error ******', error);
    next(error);
  }
};
