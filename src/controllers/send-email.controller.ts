import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';

import SurveyRepository from '../repositories/SurveyRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsers.repository';
import UsersRepository from '../repositories/UsersRepository';
import SendEmailService from './../services/send-email.service';


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
        return res.status(400).json({ error: 'User does not exists!' });
      }

      // Checks whether the survey exist in the table
      const survey = await surveyRepository.findOne({ id: survey_id });
      if (!survey) {
        return res.status(400).json({ error: 'Survey does not exists!' });
      }

      // Variáveis que serão passadas para o template
      const variables = {
        name: user.name,
        title: survey.title,
        description: survey.description,
        href: `${process.env.BASE_URL}/answers`,
        user_id: user.id,
      }
      const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

      // Se já houver uma pesquisa e que o valor for null
      const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
        where: [{ user_id: user.id }, { value: null } ],
        relations: ['user', 'survey']
      });
      if (surveyUserAlreadyExists && survey.title) {
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
      if (survey.title && survey.description) {
        SendEmailService.execute(email, survey.title, variables, npsPath)
      }

      return res.status(201).json(newSurveryUser);

    } catch(err) {
      return res.status(500).json({ error: 'Internal server error!' })
    }
  }
}
