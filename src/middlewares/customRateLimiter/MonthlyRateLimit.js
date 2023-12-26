import { rateLimitHandler } from './rateLimitHandler.js';

export const monthlyRateLimiter = async (req, res, redisClient) => {
  const WINDOW_SIZE_IN_SECONDS = 60 * 60 * 24 * 30; // this adds up to 30 days
  const { apiKeyInstance } = req;

  await rateLimitHandler({ context: 'monthlyToken', apiKeyInstance, redisClient, WINDOW_SIZE_IN_SECONDS, res });
};
