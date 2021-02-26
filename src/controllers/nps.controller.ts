import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import AppError from "../errors/app.error";
// import * as Yup from 'yup';
import { SurveysUsersRepository } from "../repositories/SurveysUsers.repository";

export default class NpsController {

  /**
   * Cáculo do nps
   *
   * 1 2 3 4 5 6 7 8 9 10
   *
   * Destratores: 1 - 6
   * Passivos: 7 e 8
   * Promotores: 9 e 10
   *
   * (Número de promotores - número de detratores) / número de respondentes * 100
   */

  async execute(req: Request, res: Response) {
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const { survey_id } = req.params;

    // get all the surveys that have been answered
    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull())
    });
    if (!surveysUsers) {
      throw new AppError('Survey does not exists!', 400);
    }

    // Get length of destractors, passives and promotors
    const detractors = surveysUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;

    const passives = surveysUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;

    const promoters = surveysUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const totalAnswers = surveysUsers.length;

    // Calculating the nps
    const calculate = Number(((promoters - detractors) / totalAnswers * 100).toFixed(2));

    return res.status(200).json({
      detractors,
      passives,
      promoters,
      totalAnswers,
      nps: calculate
    });
  }
}
