import { PaymentStatus } from '../enums/paymentStatus';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class PaymentDetails {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar' })
  payment_method: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
