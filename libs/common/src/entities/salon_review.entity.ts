import { Salon } from './salon.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class SalonReview {
  @PrimaryGeneratedColumn()
  reviewId: number;

  @Column()
  salonId: number;

  @ManyToOne(() => Salon, (salon) => salon.reviews)
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

  @Column()
  userId: number;

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
