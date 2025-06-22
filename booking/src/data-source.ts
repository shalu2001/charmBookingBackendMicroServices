import { Salon } from './salon/salon.entity';
import { SalonCategory } from './salon_categories/salon_category.entity';
import { SalonService } from './salon_services/salon_service.entity';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Shalu.215023',
  database: 'charmbooking',
  entities: [Salon, SalonCategory, SalonService],
  migrations: ['src/migrations/*.ts'],
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
