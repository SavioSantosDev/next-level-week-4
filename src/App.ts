import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import createConnection from './database';
import userRoutes from './routes/userRoutes';
import surveyRoutes from './routes/surveyRoutes';
import sendEmailRoutes from './routes/send-email.routes';
import answerRoutes from './routes/answer.routes';
import npsRoutes from './routes/nps.routes';
import AppError from './errors/app.error';


class App {

  app;

  constructor() {
    createConnection();
    this.app = express();
    this.middlewares();
    this.routes();
    this.errors();
  }


  /**
   * Middlewares that will run before routes
   */
  middlewares(): void {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }


  /**
   * Routes of the our application
   */
  routes(): void {
    this.app.use('/users', userRoutes);
    this.app.use('/surveys', surveyRoutes);
    this.app.use('/send-email', sendEmailRoutes);
    this.app.use('/answers', answerRoutes);
    this.app.use('/nps', npsRoutes);
  }


  /**
   * Handling the errors
   */
  errors() {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof AppError) {
          return res.status(err.statusCode).json({
            message: err.message
          });
        }

        return res.status(500).json({
          message: 'insternal server error!'
        })
      }
    )
  }
}

export default new App().app;
