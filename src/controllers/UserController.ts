import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { User } from "../models/User";
import UsersRepository from "../repositories/UsersRepository";

class UserController {
  /**
   * Criar um usuário na tabela
   */
  async create(req: Request, res: Response ) {

    // Repositório para permitir manipulação dentro do banco de dados
    const userRepository = getCustomRepository(UsersRepository);

    // Desestruturando os dados.
    const { name, email }: User = req.body;

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
