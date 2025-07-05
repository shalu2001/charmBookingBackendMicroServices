import { DataSource } from 'typeorm';
import * as entities from './entities';
import { getConfig } from './getConfig';

const config = getConfig();

export const dataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: 'charmbooking',
  entities: Object.values(entities),
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
});
dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
