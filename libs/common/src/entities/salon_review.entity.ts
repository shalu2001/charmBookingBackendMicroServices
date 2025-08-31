import { Salon } from './salon.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';

@Entity()
export class SalonReview {
  @PrimaryGeneratedColumn()
  reviewId: number;

  @Column()
  salonId: string;

  @ManyToOne(() => Salon, (salon) => salon.reviews)
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

  @Column()
  bookingId: string;

  @OneToOne(() => Booking, (booking) => booking.review)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
