import { apiKeys } from '../constants/apiKeys';

export const checkApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const apiKeyInstance = apiKeys.find((keyInstance) => keyInstance.key === apiKey);
    if (!apiKey || !apiKeyInstance) {
      res.status(401).jsend.error('Unauthorized');
    }
    req.apiKeyInstance = apiKeyInstance;
    next();
  } catch (error) {
    next(error);
  }
};
