import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { SalonService } from './salon_service.entity';
import { IsLatitude, IsLongitude, IsEmail } from 'class-validator';
import { SalonReview } from './salon_review.entity';
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

  @IsEmail()
  @Column()
  email: string;

  @Column()
  website: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 8 })
  @IsLongitude()
  longitude: number;

  @Column('decimal', { precision: 10, scale: 8 })
  @IsLatitude()
  latitude: number;

  @OneToMany(() => SalonReview, (review) => review.salon)
  reviews: SalonReview[];
}
