import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SalonReview } from './salon_review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 100 })
  role: string;

  @OneToMany(() => SalonReview, (review) => review.userId)
  reviews: SalonReview[];

  // @Column({ type: 'text', nullable: true })
  // profilePicture: string;

  @Column({ type: 'text', nullable: true })
  token: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
