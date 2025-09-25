import { Salon } from './salon.entity';
import { SalonCategory } from './salon_category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SalonWorker } from './salon_worker.entity';

@Entity()
export class SalonService {
  @PrimaryGeneratedColumn('uuid')
  serviceId: string;

  @Column()
  salonId: string;

  @ManyToOne(() => Salon, (salon) => salon.id, {
    cascade: true,
  })
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

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

  @ManyToMany(() => SalonWorker, (worker) => worker.services)
  workers: SalonWorker[];
}
