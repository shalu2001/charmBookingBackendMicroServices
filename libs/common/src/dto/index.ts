export interface CheckServiceTimeAvailabilityDto {
  salonId: string;
  serviceId: string;
  date: string;
  startTime: string;
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
  workerId: string;
}

export interface BookingRequestDTO {
  salonId: string;
  userId: string;
  serviceId: string;
  date: string;
  startTime: string;
  workerId: string;
}
