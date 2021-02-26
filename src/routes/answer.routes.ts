import { Router } from 'express'
import AnswerController from '../controllers/answer.controller';

const routes = Router();

const answerController = new AnswerController();

routes.get('/:value', answerController.execute)

export default routes;
