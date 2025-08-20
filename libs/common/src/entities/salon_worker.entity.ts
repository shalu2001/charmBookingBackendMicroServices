import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Salon } from './salon.entity';
import { SalonService } from './salon_service.entity';

@Entity('salon_worker')
export class SalonWorker {
  @PrimaryGeneratedColumn('uuid')
  workerId: string;

  @Column()
  password: string;

  @Column()
  salonId: string;

  @ManyToOne(() => Salon, (salon) => salon.id, {
    cascade: true,
  })
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

  @ManyToMany(() => SalonService, (service) => service.workers)
  @JoinTable({
    name: 'salon_worker_services',
    joinColumn: {
      name: 'workerId',
      referencedColumnName: 'workerId',
    },
    inverseJoinColumn: {
      name: 'serviceId',
      referencedColumnName: 'serviceId',
    },
  })
  services: SalonService[];
}
