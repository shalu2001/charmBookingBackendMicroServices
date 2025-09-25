import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SalonWorker } from './salon_worker.entity';

//TODO: FIX this entity
@Entity('salon_worker_leave')
export class SalonWorkerLeave {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  workerId: string;
  @ManyToOne(() => SalonWorker, (worker) => worker.workerId, {
    onDelete: 'CASCADE',
  })
  worker: SalonWorker;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;
}
