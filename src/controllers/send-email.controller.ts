import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';

import SurveyRepository from '../repositories/SurveyRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsers.repository';
import UsersRepository from '../repositories/UsersRepository';
import SendEmailService from './../services/send-email.service';
import AppError from '../errors/app.error';


export class SendEmailController {

  async execute(req: Request, res: Response) {

    try {
      const userRepository = getCustomRepository(UsersRepository);
      const surveyRepository = getCustomRepository(SurveyRepository);
      const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

      const { email, survey_id } = req.body;

      // Checks whether the users exisits
      const user = await userRepository.findOne({ email });
      if (!user) {
        throw new AppError('User does not exists!', 400);
      }

      // Checks whether the survey exist in the table
      const survey = await surveyRepository.findOne({ id: survey_id });
      if (!survey) {
        throw new AppError('Survey does not exists!', 400);
      }

      const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');


      const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
        // where: [{ user_id: user.id }, { value: null } ], // Se já houver uma pesquisa OU que o valor for null
        where: { user_id: user.id,  value: null }, // Se já houver uma pesquisa E que o valor for null
        relations: ['user', 'survey']
      });

      // Variáveis que serão passadas para o template
      const variables = {
        name: user.name,
        title: survey.title,
        description: survey.description,
        href: `${process.env.BASE_URL}/answers`,
        id: '',
      }

      if (surveyUserAlreadyExists && survey.title) {
        variables.id = surveyUserAlreadyExists.id;
        SendEmailService.execute(email, survey.title, variables, npsPath);
        return res.status(200).json(surveyUserAlreadyExists);
      }

      // Creating and saving the user survey in the table
      const newSurveryUser = surveysUsersRepository.create({
        user_id: user.id,
        survey_id
      });
      await surveysUsersRepository.save(newSurveryUser);

      // Send email
      if (survey.title && survey.description && survey.id) {
        variables.id = survey.id;
        SendEmailService.execute(email, survey.title, variables, npsPath)
      }

      return res.status(201).json(newSurveryUser);

    } catch(err) {
      throw new AppError('Internal server error!', 500);
    }
  }
}
