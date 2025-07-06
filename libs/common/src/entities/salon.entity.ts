import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsLatitude, IsLongitude, IsEmail } from 'class-validator';
import { SalonReview } from './salon_review.entity';
import { SalonImage } from './salon_images.entity';
import { SalonService } from './salon_service.entity';
@Entity()
export class Salon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  ownerName: string;

  @Column()
  location: string;

  @Column()
  phone: string;

  @IsEmail()
  @Column()
  email: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 8 })
  @IsLongitude()
  longitude: number;

  @Column('decimal', { precision: 10, scale: 8 })
  @IsLatitude()
  latitude: number;

  @OneToMany(() => SalonService, (service) => service.salon)
  services: SalonService[];

  @OneToMany(() => SalonReview, (review) => review.salon)
  reviews: SalonReview[];

  @OneToMany(() => SalonImage, (image) => image.salon)
  images: SalonImage[];
}
