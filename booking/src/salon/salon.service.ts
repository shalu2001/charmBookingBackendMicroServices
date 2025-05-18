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
}
