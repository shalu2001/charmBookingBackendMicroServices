import { DayOfWeek } from '../enums/daysOfWeek';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('salon_weekly_hours')
export class SalonWeeklyHours {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  salon_id: number;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
  })
  day_of_week: DayOfWeek;

  @Column({ type: 'time' })
  open_time: string;

  @Column({ type: 'time' })
  close_time: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
