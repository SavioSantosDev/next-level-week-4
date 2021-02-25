import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import Survey from '../models/Survey';
import SurveyRepository from '../repositories/SurveyRepository';

class SurveyController {

  /**
   * Criar uma nova pesquisa na tabela
   */
  async create(req: Request, res: Response) {
    const surveryRepositoy = getCustomRepository(SurveyRepository);

    const { title, description }: Survey = req.body;

    // Criando e salvando uma pesquisa na tabela
    const newSurvey = surveryRepositoy.create({
      title, description
    });
    await surveryRepositoy.save(newSurvey);

    return res.status(201).json(newSurvey);
  }


  /**
   * Listar todas as pesquisas que estão cadsatradas no banco de dados
   */
  async index(req: Request, res: Response) {
    const surveryRepositoy = getCustomRepository(SurveyRepository);

    // Criando e salvando uma pesquisa na tabela
    const allSurveys = await surveryRepositoy.find();

    return res.status(201).json(allSurveys);
  }
}


export default SurveyController;
