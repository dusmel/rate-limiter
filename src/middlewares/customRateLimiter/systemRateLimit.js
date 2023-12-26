import dayjs from 'dayjs';
import isEmpty from '../../helpers/isEmpty.js';
import { defaultSystemToken } from '../../constants/tokens.js';

export const systemRateLimiter = async ({ redisClient, res }) => {
  const WINDOW_SIZE_IN_SECONDS = 3;
  const key = 'systemRateLimit';

  const record = await redisClient.hGetAll(key);
  const currentRequestTime = dayjs();

  //  if no record is found , create a new record for user and store to redis
  if (isEmpty(record)) {
    const newRecord = {
      timeStamp: dayjs().unix(),
      token: defaultSystemToken - 1
    };
    await redisClient.hSet(key, newRecord);
    return;
  }

  // if record is found,  check if it is still within the time window, if so decrease the request count by 1 if not reset the request count to user max token
  const lastRequestTime = dayjs.unix(record.timeStamp);
  const timeDifference = currentRequestTime.diff(lastRequestTime, 'second');
  const remainingToken = record.token;
  if (timeDifference < WINDOW_SIZE_IN_SECONDS) {
    if (remainingToken > 0) {
      record.token = remainingToken - 1;
      await redisClient.hSet(key, record);
    } else {
      res.status(429).jsend.error(`System rate limit of ${defaultSystemToken} requests has been exceeded`);
    }
  } else {
    const newRecord = {
      timeStamp: dayjs().unix(),
      token: defaultSystemToken - 1
    };
    await redisClient.hSet(key, newRecord);
  }
};
