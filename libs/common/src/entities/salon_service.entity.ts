import { SalonCategory } from './salon_category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class SalonService {
  @PrimaryGeneratedColumn()
  serviceId: number;

  @ManyToMany(() => SalonCategory, (category) => category.categoryId)
  @JoinTable({
    name: 'salon_service_categories',
    joinColumn: {
      name: 'serviceId',
      referencedColumnName: 'serviceId',
    },
    inverseJoinColumn: {
      name: 'categoryId',
      referencedColumnName: 'categoryId',
    },
  })
  categories: SalonCategory[];

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  duration: number;
}
