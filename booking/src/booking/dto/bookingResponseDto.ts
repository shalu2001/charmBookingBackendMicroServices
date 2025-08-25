export class GetBookingsResponseDto {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  workerId: string;
  date: string;
  time: string;
  duration: number;
  amount: number;
  status: string;
  paymentStatus: string;
}
