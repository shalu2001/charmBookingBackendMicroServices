import { SalonService } from '@charmbooking/common';

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

export class SalonResponseDTO {
  id: number;
  name: string;
  ownerName: string;
  location: string;
  phone: string;
  email: string;
  description: string;
  longitude: number;
  latitude: number;
  services: SalonService[];
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
  services?: SalonService[];
}
