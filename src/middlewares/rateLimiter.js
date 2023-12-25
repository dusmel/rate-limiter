import rateLimit from 'express-rate-limit';

export const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 5 * 1000, // 5 seconds in milliseconds
  max: 4,
  message: { message: 'You have exceeded the 4 requests in 5 seconds limit!' },
  standardHeaders: true,
  legacyHeaders: false
});
