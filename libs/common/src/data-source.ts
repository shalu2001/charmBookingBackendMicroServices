import { DataSource } from 'typeorm';
import * as entities from './entities';

export const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'shalud23',
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
