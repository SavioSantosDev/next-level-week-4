import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import AppError from "../errors/app.error";
import { SurveysUsersRepository } from "../repositories/SurveysUsers.repository";

export default class AnswerController {

  async execute(req: Request, res: Response) {
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const { value } = req.params;
    const { u } = req.query;

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(u),
    });
    if (!surveyUser) {
      throw new AppError('Survey does not exists!', 400);
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);


    return res.status(200).json(surveyUser);
  }
}
