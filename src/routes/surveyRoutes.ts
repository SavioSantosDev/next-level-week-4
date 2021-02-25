import { Router } from 'express';
import SurveyController from '../controllers/SurveyController';

const routes = Router();
const surveyController = new SurveyController();

routes.post('/', surveyController.create);
routes.get('/', surveyController.index);

export default routes;
