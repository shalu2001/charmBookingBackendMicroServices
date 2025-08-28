// import { SalonService } from '@charmbooking/common';

export class UserMinimalDTO {
  firstName: string;
  lastName: string;
}

export class SalonReviewDTO {
  reviewId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  user: UserMinimalDTO;
}

export class SalonCategoryDTO {
  categoryId: string;
  name: string;
}
export class SalonServicesDTO {
  serviceId: string;
  name: string;
  price: number;
  duration: number;
  bufferTime: number;
  categories: SalonCategoryDTO[];
}

export class SalonResponseDTO {
  id: string;
  name: string;
  ownerName: string;
  location: string;
  phone: string;
  email: string;
  description: string;
  longitude: number;
  latitude: number;
  reviews: SalonReviewDTO[];
}

export class SalonRegisterDTO {
  name: string;
  ownerName: string;
  location: string;
  phone: string;
  email: string;
  description: string;
  longitude: number;
  latitude: number;
  password: string;
}

export class SalonReviewRequestDto {
  salonId: string;
  userId: string;
  rating: number;
  comment: string;
}
