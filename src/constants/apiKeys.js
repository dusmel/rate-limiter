// 💡 ideally API keys wont be hard corder the way it is done here, but for the sake of simplicity, we will hard code it here. On a real world scenario, we will have a database of API keys and we will validate the API key against the database.

import { defaultMonthlyToken, defaultTimeWindowToken } from './tokens';

export const apiKeys = [
  {
    key: '0852b9b3-ee95774f',
    timeWindowToken: defaultTimeWindowToken,
    monthlyToken: defaultMonthlyToken
  },
  {
    key: '2233aa7f-7729134c',
    timeWindowToken: defaultTimeWindowToken,
    monthlyToken: defaultMonthlyToken
  },
  {
    key: '2233aa7f-7729134c',
    timeWindowToken: 10,
    monthlyToken: 500
  }
];
