import { PaymentStatus } from '../enums/paymentStatus';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PaymentDetails {
  @PrimaryGeneratedColumn()
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

  @Column({ type: 'varchar' })
  transaction_reference: string;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
