import { Router } from 'express';
import { getEmails } from './email.controller';

const emailRouter = new Router();

emailRouter.get('/', getEmails);

export default emailRouter;
