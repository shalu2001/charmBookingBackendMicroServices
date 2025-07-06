import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salon } from '@charmbooking/common';
import { SalonRegisterDTO, SalonResponseDTO } from 'src/dto/salonResponse';

@Injectable()
export class SalonService {
  constructor(
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
  ) {}

  async findAll(): Promise<Salon[]> {
    return this.salonRepository.find();
  }

  async createSalon(salonData: SalonRegisterDTO): Promise<Salon> {
    const newSalon = this.salonRepository.create(salonData);
    return this.salonRepository.save(newSalon);
  }

  async findById(id: string): Promise<SalonResponseDTO> {
    const salon = await this.salonRepository.findOne({
      where: { id },
      relations: ['services', 'services.categories', 'reviews', 'reviews.user'],
    });

    if (!salon) {
      throw new Error('Salon not found');
    }
    // Map reviews to only include user name
    const reviews = salon.reviews.map((review) => ({
      reviewId: review.reviewId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: {
        firstName: review.user?.firstName,
        lastName: review.user?.lastName,
      },
    }));

    return {
      ...salon,
      reviews,
    };
  }
}
