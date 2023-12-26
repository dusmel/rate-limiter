import dayjs from 'dayjs';

export const rateLimitHandler = async ({ context, apiKeyInstance, redisClient, WINDOW_SIZE_IN_SECONDS = 10, res }) => {
  const { key, ...tokens } = apiKeyInstance;
  const currentToken = tokens?.[context];

  const recordString = await redisClient.get(key);
  const record = JSON.parse(recordString);
  const currentRecord = record?.[context];
  const currentRequestTime = dayjs();

  //  if no record is found , create a new record for user and store to redis
  if (!currentRecord) {
    const newRecord = {
      ...record,
      [context]: {
        timeStamp: dayjs().unix(),
        token: currentToken - 1
      }
    };
    await redisClient.set(key, JSON.stringify(newRecord));
    return;
  }

  // if record is found,  check if it is still within the time window, if so decrease the request count by 1 if not reset the request count to user max token
  const lastRequestTime = dayjs.unix(currentRecord.timeStamp);
  const timeDifference = currentRequestTime.diff(lastRequestTime, 'second');
  const remainingToken = currentRecord.token;
  if (timeDifference < WINDOW_SIZE_IN_SECONDS) {
    if (remainingToken > 0) {
      record[context].token = remainingToken - 1;
      await redisClient.set(key, JSON.stringify(record));
    } else {
      res
        .status(429)
        .jsend.error(
          `You have exceeded the ${currentToken} requests in ${
            context?.includes('month') ? 'a month' : ` ${WINDOW_SIZE_IN_SECONDS}  seconds`
          } limit!`
        );
    }
  } else {
    const newRecord = {
      ...record,
      [context]: {
        timeStamp: dayjs().unix(),
        token: currentToken - 1
      }
    };
    await redisClient.set(key, JSON.stringify(newRecord));
  }
};
