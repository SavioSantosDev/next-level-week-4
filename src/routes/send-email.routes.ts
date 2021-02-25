import { Router } from 'express'
import { SendEmailController } from '../controllers/send-email.controller';

const routes = Router();
const sendEmailController = new SendEmailController();

routes.post('/', sendEmailController.execute);

export default routes;
