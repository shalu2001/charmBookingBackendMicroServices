import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Salon } from './salon.entity';
import { SalonDocumentType } from '../enums';

@Entity()
export class SalonDocuments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  salonId: string;

  @ManyToOne(() => Salon, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

  @Column({ length: 255 })
  url: string;

  @Column({ type: 'enum', enum: SalonDocumentType })
  documentType: SalonDocumentType;

  @CreateDateColumn()
  createdAt: Date;
}
