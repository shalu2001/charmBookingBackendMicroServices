import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Salon, VerificationStatus } from '@charmbooking/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SalonVerifiedRepository extends Repository<Salon> {
  // Override find and findOne to only return verified salons
  constructor(
    @InjectRepository(Salon)
    repository: Repository<Salon>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  async find(options?: FindManyOptions<Salon>): Promise<Salon[]> {
    const baseOptions = {
      ...(options || {}),
      where: {
        ...(options?.where || {}),
        verificationStatus: VerificationStatus.VERIFIED,
      },
    };
    return super.find(baseOptions);
  }

  async findOne(options: FindOneOptions<Salon>): Promise<Salon | null> {
    const baseOptions = {
      ...(options || {}),
      where: {
        ...(options?.where || {}),
        verificationStatus: VerificationStatus.VERIFIED,
      },
    };
    return super.findOne(baseOptions);
  }
}
