import request from 'supertest'; // simular requisições ajax
import app from '../App';

import createConnection from '../database';

describe('Users', () => {
  // antes de tudo devemos executar nossas migrations
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations()
  });

  // Um usuário deve ser criado
  it('Should be able to create a new survey', async () => {
    const response = await request(app).post('/surveys/').send({
      title: 'Survey example',
      description: 'Description Example',
    })

    // Espero que o resopnse seja o status de um usuário criado
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  // Vamos criar mais um usuário e esperamos que o tamanho do array seja 2
  it('Should be able to get all surveys', async () => {
    await request(app).post('/surveys/').send({
      title: 'Survey example',
      description: 'Description Example',
    });

    const response = await request(app).get('/surveys');

    expect(response.body.length).toBe(2);
  });
});
