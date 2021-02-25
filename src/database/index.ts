import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (): Promise<Connection> => {

  // Obtendo todas as informações que estão dentro do ormconfig.json
  const defaultOptions = await getConnectionOptions();

  // Verificando qual banco utilizadar dependendo do ambiente. dev, prod ou test
  return createConnection(
    // dentor das configurações, alterar somente a prop database
    Object.assign(defaultOptions, {
      database: process.env.NODE_ENV === 'test'
        ? './src/database/database.test.sqlite'
        : defaultOptions.database
    })
  );
}
