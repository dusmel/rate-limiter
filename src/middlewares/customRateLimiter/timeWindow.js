import { rateLimitHandler } from './rateLimitHandler.js';

export const timeWindowLimiter = async (req, res, redisClient) => {
  const WINDOW_SIZE_IN_SECONDS = 10;
  const { apiKeyInstance } = req;

  await rateLimitHandler({ context: 'timeWindowToken', apiKeyInstance, redisClient, WINDOW_SIZE_IN_SECONDS, res });
};
