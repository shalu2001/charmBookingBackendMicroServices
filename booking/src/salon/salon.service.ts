import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Salon } from './salon.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SalonService {
  constructor(
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
  ) {}

  async findAll(): Promise<Salon[]> {
    return this.salonRepository.find();
  }

  async createSalon(salonData: Salon): Promise<Salon> {
    const newSalon = this.salonRepository.create(salonData);
    return this.salonRepository.save(newSalon);
  }

  async findById(id: number): Promise<Salon> {
    const salon = await this.salonRepository.findOne({
      where: { id },
      relations: ['categories', 'services'],
    });

    if (!salon) {
      throw new Error('Salon not found');
    }
    return salon;
  }
}
