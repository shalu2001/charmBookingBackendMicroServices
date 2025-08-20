import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Salon } from './salon.entity';

@Entity('salon_admin')
export class SalonAdmin {
  @PrimaryGeneratedColumn('uuid')
  adminId: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salonId: string;

  @OneToOne(() => Salon, (salon) => salon.id, {
    cascade: true,
  })
  @JoinColumn({ name: 'salonId' })
  salon: Salon;
}
