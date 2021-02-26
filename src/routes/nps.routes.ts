import { Router } from 'express'
import NpsController from '../controllers/nps.controller';

const routes = Router();

const npsController = new NpsController();

routes.get('/:survey_id', npsController.execute)

export default routes;
