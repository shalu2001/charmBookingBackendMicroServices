import {
  Entity,
  Column,
  Timestamp,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SalonWorker } from './salon_worker.entity';

//TODO: FIX this entity
@Entity('salon_worker_leave')
export class SalonWorkerLeave {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  workerId: number;
  @ManyToOne(() => SalonWorker, (worker) => worker.workerId, {
    onDelete: 'CASCADE',
  })
  worker: SalonWorker;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startTime: Date;

  @Column({ type: 'time' })
  endTime: Date;
}
