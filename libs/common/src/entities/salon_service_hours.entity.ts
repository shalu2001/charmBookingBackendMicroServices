import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { SalonService } from './salon_service.entity';
import { DayOfWeek } from '../enums/daysOfWeek';

@Entity('salon_service_hours')
export class SalonServiceHours {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  salon_service_id: string;

  @ManyToOne(() => SalonService, (service) => service.serviceId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'salon_service_id' })
  salon_service: SalonService;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
  })
  day_of_week: DayOfWeek;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
