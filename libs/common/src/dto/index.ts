export interface GetAvailableSlotsDto {
  salonId: string;
  serviceId: string;
  date: string;
  startTime: string;
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
