import request from 'supertest'; // simular requisições ajax
import { getConnection } from 'typeorm';
import app from '../App';

import createConnection from '../database';

describe('Users', () => {
  // antes de tudo devemos executar nossas migrations
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations()
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  // Um usuário deve ser criado
  it('Should be able to create a new User', async () => {
    const response = await request(app).post('/users/').send({
      email: 'user@example.com',
      name: 'User Example',
    })

    // Espero que o resopnse seja o status de um usuário criado
    expect(response.status).toBe(201);
  });

  // Se o usuário acima for criado o de baixo não deve ser, por isso devemos esperar um stauts.400
  it('Should not be able to create a user with exists email', async () => {
    const response = await request(app).post('/users/').send({
      email: 'user@example.com',
      name: 'User Example',
    })

    // Espero que o resopnse seja o status de um usuário criado
    expect(response.status).toBe(400);
  });

  // No final dos testes o banco de dados de testes será apago com o scirpt posttest na no package.json
});
