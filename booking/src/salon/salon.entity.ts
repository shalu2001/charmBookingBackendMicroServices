import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { SalonService } from '../salon_services/salon_service.entity';
@Entity()
export class Salon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ownerName: string;

  @ManyToMany(() => SalonService, (service) => service.serviceId)
  @JoinTable({
    name: 'salon_services',
    joinColumn: {
      name: 'salon_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'service_id',
      referencedColumnName: 'serviceId',
    },
  })
  services: SalonService[];

  @Column()
  location: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  website: string;

  @Column()
  description: string;
}
