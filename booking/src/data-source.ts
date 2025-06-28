import { Salon } from '../../libs/common/src/entities/salon.entity';
import { SalonCategory } from '../../libs/common/src/entities/salon_category.entity';
import { SalonReview } from '../../libs/common/src/entities/salon_review.entity';
import { SalonService } from '../../libs/common/src/entities/salon_service.entity';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Shalu.215023',
  database: 'charmbooking',
  entities: [Salon, SalonCategory, SalonService, SalonReview],
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
