import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Salon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  website: string;

  @Column()
  description: string;
}
