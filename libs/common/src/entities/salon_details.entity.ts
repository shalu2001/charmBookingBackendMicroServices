import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { Salon } from './salon.entity';

@Entity()
export class SalonDetails {
  @PrimaryColumn()
  salonId: string;

  @ManyToOne(() => Salon, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

  @Column({ length: 12 })
  owner_nic: string;

  @Column({ length: 255 })
  bank_account_full_name: string;

  @Column({ length: 20 })
  bank_account_number: string;

  @Column({ length: 255 })
  bank_name: string;

  @Column({ length: 255 })
  bank_branch: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
