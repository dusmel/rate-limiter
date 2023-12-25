// import moment from 'moment';
import dayjs from 'dayjs';
import { createClient } from 'redis';

const redisClient = createClient();
redisClient.on('error', (err) => console.error('>>>>>>> Redis Client Error', err));
redisClient.on('connect', () => {
  console.log('>>>>>>>>>. Connected to Redis');
});

export const customRedisRateLimiterTokenBucket = async (req, res, next) => {
  const WINDOW_SIZE_IN_SECONDS = 10;

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  try {
    // check that redis client exists
    if (!redisClient) {
      throw new Error('Redis client does not exist!');
    }

    const { apiKeyInstance } = req;
    const { key, token } = apiKeyInstance;

    const record = await redisClient.hGetAll(key);
    const currentRequestTime = dayjs();

    //  if no record is found , create a new record for user and store to redis
    if (record == null) {
      const newRecord = {
        timeStamp: dayjs().unix(),
        token
      };
      await redisClient.hSet(key, newRecord);
      next();
    }

    // if record is found,  check if it is still within the time window, if so decrease the request count by 1 if not reset the request count to user max token
    const lastRequestTime = dayjs.unix(record.timeStamp);
    const timeDifference = currentRequestTime.diff(lastRequestTime, 'second');
    const remainingToken = record.token;
    if (timeDifference < WINDOW_SIZE_IN_SECONDS) {
      if (remainingToken > 0) {
        record.token = remainingToken - 1;
        await redisClient.hSet(key, record);
        next();
      } else {
        res
          .status(429)
          .jsend.error(`You have exceeded the ${token} requests in ${WINDOW_SIZE_IN_SECONDS} seconds limit!`);
      }
    } else {
      const newRecord = {
        timeStamp: dayjs().unix(),
        token
      };
      await redisClient.hSet(key, newRecord);
      next();
    }
  } catch (error) {
    console.log('***** error ******', error);
    next(error);
  }
};
