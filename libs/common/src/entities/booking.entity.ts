import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Salon } from './salon.entity';
import { SalonService } from './salon_service.entity';
import { PaymentDetails } from './payment_details.entity';
import { BookingStatus } from '../enums/bookingStatus';
import { SalonWorker } from './salon_worker.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  salon_id: string;

  @Column()
  salon_service_id: string;

  @Column({ nullable: true })
  payment_id?: number;

  @Column({ nullable: true })
  worker_id: string;

  @Column({ type: 'date' })
  booking_date: string;

  @Column({ type: 'time' })
  start_time: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
  })
  status: BookingStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Salon, (salon) => salon.id, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'salon_id' })
  salon: Salon;

  @ManyToOne(() => SalonService, (service) => service.serviceId, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'salon_service_id' })
  salonService: SalonService;

  @ManyToOne(() => PaymentDetails, (payment) => payment.id, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'payment_id' })
  payment?: PaymentDetails;

  @ManyToOne(() => SalonWorker, (worker) => worker.workerId, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'worker_id' })
  worker: SalonWorker;
}
