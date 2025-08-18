import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getConfig, Salon, SalonImage } from '@charmbooking/common';
import { SalonRegisterDTO, SalonResponseDTO } from 'src/dto/salonResponse';
import { GenericError } from '@charmbooking/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SalonService {
  constructor(
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
    @InjectRepository(SalonImage)
    private salonImageRepository: Repository<SalonImage>,
    private jwtService: JwtService,
  ) {}

  private async checkSalonExists(email: string): Promise<void> {
    const salon = await this.salonRepository.findOne({
      where: { email: email },
    });
    if (salon) {
      throw new GenericError(
        `Salon with email ${email} already exists.`,
        HttpStatus.CONFLICT,
      );
    }
  }
  async findAll(): Promise<Salon[]> {
    return this.salonRepository.find();
  }

  async createSalon(
    salonData: SalonRegisterDTO,
    images: Array<Express.Multer.File>,
  ): Promise<Salon> {
    console.log('salon', salonData);
    await this.checkSalonExists(salonData.email);

    //hash password before saving to db
    const hashedPassword = await bcrypt.hash(salonData.password, 10);

    const newSalon = this.salonRepository.create({
      ...salonData,
      password: hashedPassword,
    });
    if (!newSalon) {
      throw new GenericError(
        'Failed to create salon',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const savedSalon = await this.salonRepository.save(newSalon);

    // Save image URLs with salonId and salon reference
    if (images && images.length > 0) {
      const baseUrl = `http://localhost:${getConfig().services.apiGateway.port}`;
      const salonImages = images.map((image) => ({
        url: `${baseUrl}/uploads/${image.filename}`,
        salonId: Number(savedSalon.id),
        salon: savedSalon,
      }));
      await this.salonImageRepository.save(salonImages);
    }

    return savedSalon;
  }

  async salonLogin(email: string, password: string): Promise<any> {
    const salon = await this.salonRepository.findOne({
      where: { email },
    });
    if (!salon) {
      throw new GenericError(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, salon.password);
    if (!isPasswordValid) {
      throw new GenericError(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    //generate JWT token
    const token = this.jwtService.sign({
      id: salon?.id,
      email: salon?.email,
      role: 'salonOwner',
    });
    const { password: _, ...salonWithoutPassword } = salon;
    return { token, salon: salonWithoutPassword };
  }

  //fetches salon details for the salonPage
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
