import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  calcLatLongDistance,
  getConfig,
  Salon,
  SalonAdmin,
  SalonImage,
  SalonRankedRequestDto,
  SalonWithRank,
  UserRole,
  SalonWeeklyHours,
  SalonReview,
} from '@charmbooking/common';
import {
  SalonRegisterDTO,
  SalonResponseDTO,
  SalonReviewRequestDto,
} from 'src/dto/salonResponse';
import { GenericError } from '@charmbooking/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BookingService } from 'src/booking/booking.service';

@Injectable()
export class SalonService {
  constructor(
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
    @InjectRepository(SalonImage)
    private salonImageRepository: Repository<SalonImage>,
    private jwtService: JwtService,
    @InjectRepository(SalonAdmin)
    private salonAdminRepository: Repository<SalonAdmin>,
    private readonly bookingService: BookingService,
    @InjectRepository(SalonWeeklyHours)
    private readonly weeklyHoursRepository: Repository<SalonWeeklyHours>,
    @InjectRepository(SalonReview)
    private readonly salonReviewRepository: Repository<SalonReview>,
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
  async findAll(): Promise<SalonResponseDTO[]> {
    const salons = await this.salonRepository.find();
    if (!salons || salons.length === 0) {
      throw new GenericError('No salons found', HttpStatus.NOT_FOUND);
    }
    return salons;
  }

  async findAllRanked({
    categoryId,
    longitude,
    latitude,
    date,
    time,
  }: SalonRankedRequestDto): Promise<SalonWithRank[]> {
    const allSalons = await this.salonRepository.find({
      relations: ['services', 'services.categories', 'reviews', 'images'],
    });

    if (!allSalons || allSalons.length === 0) {
      throw new GenericError('No salons found', HttpStatus.NOT_FOUND);
    }

    // Filter salons that offer services in the requested category
    const filteredSalons = allSalons.filter((salon) => {
      return salon.services?.some((service) =>
        service.categories?.some(
          (category) => category.categoryId === categoryId,
        ),
      );
    });

    if (filteredSalons.length === 0) {
      throw new GenericError(
        'No salons found offering services in this category',
        HttpStatus.NOT_FOUND,
      );
    }

    // Calculate scores for each salon
    const salonScores = await Promise.all(
      filteredSalons.map(async (salon) => {
        // Distance score - max 100 points
        // Assuming farther = lower score, max distance considered is 20km
        const distanceInKm = calcLatLongDistance(
          latitude,
          longitude,
          salon.latitude,
          salon.longitude,
        );
        const distanceScore = ((100 - distanceInKm) / 100) * 100;

        // Reviews score - max 35 points
        // Calculate average rating (scale 1-5)
        let reviewScore = 0;
        if (salon.reviews && salon.reviews.length > 0) {
          const avgRating =
            salon.reviews.reduce((sum, review) => sum + review.rating, 0) /
            salon.reviews.length;

          // Weight by number of reviews (more reviews = more reliable)
          // Factor starts at 0.5 and approaches 1 as review count increases
          const reviewCountFactor =
            1 - 0.5 * Math.exp(-salon.reviews.length / 10);

          // Convert to 35 point scale with review count weighting
          reviewScore = (avgRating / 5) * 35 * reviewCountFactor;
        }

        // Availability score - max 65 points
        let availabilityScore = 0;
        // For each service in the salon that matches the category
        const categoryServices = salon.services.filter((service) =>
          service.categories.some(
            (category) => category.categoryId === categoryId,
          ),
        );

        if (categoryServices.length > 0) {
          // Check availability for each qualifying service
          const availabilityChecks = await Promise.all(
            categoryServices.map((service) =>
              this.bookingService.checkServiceTimeAvailability(
                salon.id,
                service.serviceId,
                date,
                time,
              ),
            ),
          );

          // If any service is available at the requested time, assign full points
          // Otherwise give partial points based on how many services have slots later
          const hasExactSlot = availabilityChecks.some(
            (check) => check.slots.length > 0,
          );
          const hasLaterSlot = availabilityChecks.some(
            (check) => check.nextAvailableSlot,
          );

          if (hasExactSlot) {
            availabilityScore = 65;
          } else if (hasLaterSlot) {
            // Find the soonest nextAvailableSlot among all services
            const nextSlots = availabilityChecks
              .map((check) => check.nextAvailableSlot)
              .filter((slot) => slot && slot.date)
              .sort(
                (a, b) =>
                  new Date(a!.date).getTime() - new Date(b!.date).getTime(),
              );

            if (nextSlots && nextSlots.length > 0) {
              const requestedDateTime = new Date(`${date}T${time}`);
              const nextSlotDateTime = nextSlots[0]?.date
                ? new Date(nextSlots[0].date)
                : new Date();
              const diffMinutes = Math.max(
                0,
                (nextSlotDateTime.getTime() - requestedDateTime.getTime()) /
                  60000,
              );
              // Score decreases linearly from 30 (0 min wait) to 0 (wait >= 2h)
              const maxWaitMinutes = 2 * 60;
              availabilityScore =
                ((maxWaitMinutes - diffMinutes) / maxWaitMinutes) * 65;
            }
          }
        }

        // Calculate total score (max 200)
        const totalScore = distanceScore + reviewScore + availabilityScore;

        return {
          ...salon,
          score: totalScore,
          distanceScore,
          reviewScore,
          availabilityScore,
          distanceKm: distanceInKm,
        };
      }),
    );
    console.log('Salon scores computed:', salonScores);
    // Filter salons with score at least 50, and sort by total score
    const rankedSalons = salonScores
      .filter((salon) => salon.score >= 50)
      .sort((a, b) => b.score - a.score)
      .map((salon, index) => ({
        ...salon,
        rank: index + 1,
        // Clean up temporary scoring fields if you don't want them in response
        distanceScore: undefined,
        reviewScore: undefined,
        availabilityScore: undefined,
      }));

    return rankedSalons;
  }

  async createSalon(
    salonData: SalonRegisterDTO,
    images: Array<Express.Multer.File>,
  ): Promise<Salon> {
    await this.checkSalonExists(salonData.email);

    const newSalon = this.salonRepository.create({
      ...salonData,
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
    //hash password before saving to db
    const hashedPassword = await bcrypt.hash(salonData.password, 10);
    const newSalonAdmin = this.salonAdminRepository.create({
      email: salonData.email,
      password: hashedPassword,
      salonId: newSalon.id,
    });
    await this.salonAdminRepository.save(newSalonAdmin);

    if (!newSalonAdmin) {
      throw new GenericError(
        'Failed to create salon admin',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return savedSalon;
  }

  // TODO: Move to a separate service for salon admin
  async salonLogin(email: string, password: string): Promise<any> {
    const salon = await this.salonAdminRepository.findOne({
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
      id: salon?.salonId,
      adminId: salon?.adminId,
      email: salon?.email,
      role: UserRole.SalonAdmin,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...salonWithoutPassword } = salon;
    return { token, salon: salonWithoutPassword };
  }

  //fetches salon details for the salonPage
  async findById(id: string): Promise<SalonResponseDTO> {
    const salon = await this.salonRepository.findOne({
      where: { id },
      relations: [
        'services',
        'services.categories',
        'reviews',
        'reviews.user',
        'images',
      ],
    });

    if (!salon) {
      throw new Error('Salon not found');
    }
    //salon weekly hours
    const weeklyHours = await this.weeklyHoursRepository.find({
      where: { salon_id: id },
    });
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
      weeklyHours,
    } as SalonResponseDTO;
  }

  async findSalonProfileById(id: string): Promise<any> {
    const salon = await this.salonRepository.findOne({
      where: { id },
    });
    //fetch salon payment details
    if (!salon) {
      throw new GenericError('Salon not found', HttpStatus.NOT_FOUND);
    }
    return salon;
  }

  async addReview(reviewData: SalonReviewRequestDto): Promise<any> {
    console.log('Adding salon review:', reviewData);
    const { salonId, userId, rating, comment } = reviewData;

    const newReview = this.salonReviewRepository.create({
      salonId,
      userId,
      rating,
      comment,
    });

    if (!newReview) {
      throw new GenericError(
        'Failed to create salon review',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.salonReviewRepository.save(newReview);
    return newReview;
  }
}
