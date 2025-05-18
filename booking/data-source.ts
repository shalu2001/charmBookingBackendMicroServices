import { DataSource } from 'typeorm';
import { Salon } from './src/salon/salon.entity';

export const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Shalu.215023',
  database: 'charmbooking',
  entities: [Salon],
  // migrations: ['src/migrations/*.ts'],
  synchronize: true,
});
dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
