import { Entity, Column, Timestamp, ManyToOne } from 'typeorm';
import { SalonWorker } from './salon_worker.entity';

@Entity('salon_worker_leave')
export class SalonWorkerLeave {
  @Column()
  workerId: number;
  @ManyToOne(() => SalonWorker, (worker) => worker.workerId, {
    onDelete: 'CASCADE',
  })
  worker: SalonWorker;

  @Column()
  startDate: Timestamp;

  @Column()
  endDate: Timestamp;

  @Column()
  reason: string;
}
