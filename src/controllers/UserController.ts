import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import * as yup from 'yup';
import { ValidationError } from 'yup';

import { User } from "../models/User";
import UsersRepository from "../repositories/UsersRepository";

class UserController {
  /**
   * Criar um usuário na tabela
   */
  async create(req: Request, res: Response ) {

    // Desestruturando os dados.
    const { name, email }: User = req.body;

    // Validando os dados
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required()
    })
    // if (!await schema.isValid(req.body)) {
    //   return res.status(400).json({
    //     error: 'Validation Errors'
    //   });
    // }
    try {
      await schema.validate(req.body, { abortEarly: false });

    } catch(err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({
          error: err.errors
        })
      }
    }


    // Repositório para permitir manipulação dentro do banco de dados
    const userRepository = getCustomRepository(UsersRepository);

    // Caso o usuário já exista
    const userAlreadyExists = await userRepository.findOne({
      email,
    })
    if (userAlreadyExists) {
      return res.status(400).json({
        error: 'user already exists!'
      })
    }

    // Criando o usuário e salvando-o na tabela
    const createdUser = userRepository.create({
      name, email
    });
    await userRepository.save(createdUser);

    return res.status(201).json(createdUser);
  }
}

export { UserController }
