import 'reflect-metadata';
import express from 'express';

import createConnection from './database';
import userRoutes from './routes/userRoutes';
import surveyRoutes from './routes/surveyRoutes';
import sendEmailRoutes from './routes/send-email.routes';


class App {

  app;

  constructor() {
    createConnection();
    this.app = express();
    this.middlewares();
    this.routes();
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
  }
}

export default new App().app;
