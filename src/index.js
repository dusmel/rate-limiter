import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import jsend from 'jsend';
// import config from './config';
import errorHandler from './middlewares/errorHandler.js';
import config from './config.js';
import logger from './helpers/logger.js';
import emailRouter from './api/v1/email/email.router.js';
import { rateLimiterUsingThirdParty } from './middlewares/rateLimiter.js';
import { checkApiKey } from './middlewares/checkApi.js';
import { customRedisRateLimiterTokenBucket } from './middlewares/customRateLimiter-TokenBucket.js';
import { customRedisRateLimiterSlidingWindow } from './middlewares/customRedisRateLimiter-SlidingWindow.js';

// Essential globals
const app = express();

//  Initialize global application middlewares
app.use(cors());
app.use(morgan('combined'));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(
  bodyParser.json({
    type: 'application/json'
  })
);
app.use(jsend.middleware);

app.use('/api/v1/custom/emails', checkApiKey, customRedisRateLimiterTokenBucket, emailRouter);
app.use('/api/v1/custom-v2/emails', customRedisRateLimiterSlidingWindow, emailRouter);

app.use('/api/v1/third-party/emails', rateLimiterUsingThirdParty, emailRouter);

app.use('/', (req, res) => {
  res.jsend.success({
    message: 'Welcome to rate limiter  API Gateway'
  });
});

app.listen(config.APP.PORT, () => {
  logger.info(`>>>> Starting Watchtower on  port ${config.APP.PORT}`);
});

// Initialize Global Error Handlers
app.use(errorHandler);
process.on('unhandledRejection', (reason) => {
  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${500} - ${error.message}, Stack: ${error.stack}`);
  process.exit(1);
});

process.on('SIGINT', () => {
  logger.info(' Alright! Bye bye!');
  process.exit();
});
