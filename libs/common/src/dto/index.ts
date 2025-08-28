import { SalonWorker } from '../entities/salon_worker.entity';

export interface CheckServiceTimeAvailabilityDto {
  salonId: string;
  serviceId: string;
  date: string;
  startTime: string;
}

export interface CheckServiceTimeAvailabilityResponseDto {
  slots: BookingSlot[];
  nextAvailableSlot?: BookingSlot;
}

export interface GetAvailableSlotsRequestDto {
  salonId: string;
  serviceId: string;
  date: string;
}

export interface GetAvailableSlotsResponseDto {
  salonId: string;
  serviceId: string;
  date: string;
  isHoliday: boolean;
  times: string[];
}

export interface BookingSlot {
  serviceId: string;
  date: string;
  startTime: string;
  duration: number;
  buffer: number;
  worker: SalonWorker;
}

export interface BookingRequestDto {
  salonId: string;
  userId: string;
  serviceId: string;
  date: string;
  startTime: string;
  workerId: string;
}

export interface SalonRankedRequestDto {
  categoryId: number;
  longitude: number;
  latitude: number;
  date: string;
  time: string;
}

export type SalonWithRank = {
  id: string;
  name: string;
  ownerName: string;
  location: string;
  phone: string;
  email: string;
  description: string;
  longitude: number;
  latitude: number;
  rank: number;
};
