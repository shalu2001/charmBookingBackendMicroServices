import { Salon } from './salon.entity';
import { SalonCategory } from './salon_category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class SalonService {
  @PrimaryGeneratedColumn('uuid')
  serviceId: string;

  @Column()
  salonId: string;

  @OneToMany(() => Salon, (salon) => salon.service)
  @JoinColumn({ name: 'salonId' })
  salons: Salon[];

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

  @Column()
  bufferTime: number;
}
