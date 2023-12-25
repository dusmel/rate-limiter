import { fetchSampleData } from './email.service.js';

export const getEmails = (req, res, next) => {
  try {
    const books = fetchSampleData();
    res.jsend.success(books);
  } catch (error) {
    next(error);
  }
};
