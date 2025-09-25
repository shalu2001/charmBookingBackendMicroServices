import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Salon } from './salon.entity';

@Entity()
@Unique(['salonId', 'date'])
export class SalonHoliday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  salonId: string;

  @ManyToOne(() => Salon, (salon) => salon.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
