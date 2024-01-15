import dayjs from 'dayjs';
import { createClient } from 'redis';
import config from '../config';

const redisClient = createClient({ url: config.APP.REDIS_URL });
redisClient.on('error', (err) => console.error('>>>>>>> Redis Client Error', err));
redisClient.on('connect', () => {
  console.log('>>>>>>>>>. Connected to Redis');
});

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_WINDOW_REQUEST_COUNT = 3;
const WINDOW_LOG_INTERVAL_IN_SECONDS = 2;

export const customRedisRateLimiterSlidingWindow = async (req, res, next) => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  try {
    // check that redis client exists
    if (!redisClient) {
      throw new Error('Redis client does not exist!');
    }

    // fetch records of current user using IP address, returns null when no record is found
    const record = await redisClient.get(req.ip);
    const currentRequestTime = dayjs();
    console.log(JSON.parse(record));
    //  if no record is found , create a new record for user and store to redis
    if (record == null) {
      const requestLog = {
        requestTimeStamp: currentRequestTime.unix(),
        requestCount: 1
      };

      const newRecord = [requestLog];
      await redisClient.set(req.ip, JSON.stringify(newRecord));
      next();
    }
    // if record is found, parse it's value and calculate number of requests users has made within the last window
    const data = JSON.parse(record);
    const windowStartTimestamp = dayjs().subtract(WINDOW_SIZE_IN_SECONDS, 'seconds').unix();
    const requestsWithinWindow = data.filter((entry) => entry.requestTimeStamp > windowStartTimestamp);
    console.log('requestsWithinWindow', requestsWithinWindow);
    const totalWindowRequestsCount = requestsWithinWindow.reduce(
      (accumulator, entry) => accumulator + entry.requestCount,
      0
    );
    // if number of requests made is greater than or equal to the desired maximum, return error
    if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
      res
        .status(429)
        .jsend.error(
          `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_SECONDS} seconds limit!`
        );
    } else {
      // if number of requests made is less than allowed maximum, log new entry
      const lastRequestLog = data[data.length - 1];
      const potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
        .subtract(WINDOW_LOG_INTERVAL_IN_SECONDS, 'seconds')
        .unix();
      //  if interval has not passed since last request log, increment counter
      if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
        // eslint-disable-next-line no-plusplus
        lastRequestLog.requestCount++;
        data[data.length - 1] = lastRequestLog;
      } else {
        //  if interval has passed, log new entry for current user and timestamp
        data.push({
          requestTimeStamp: currentRequestTime.unix(),
          requestCount: 1
        });
      }
      await redisClient.set(req.ip, JSON.stringify(data));
      next();
    }
  } catch (error) {
    console.log('***** error ******', error);
    next(error);
  }
};
