export class CreateSalonWorkerDto {
  name: string;
  salonId: string;
  services: string[];
}

export class SalonWorkerLeaveDto {
  date: string;
  startTime: string;
  endTime: string;
}
