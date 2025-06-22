import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SalonCategory {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column()
  name: string;
}
