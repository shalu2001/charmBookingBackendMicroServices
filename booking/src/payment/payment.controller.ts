import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PayHereService } from './payment.service';
import { PayHereNotifyDTO } from '@charmbooking/common';

@Controller('payments')
export class PaymentsController {
  constructor(private payHereService: PayHereService) {}

  @MessagePattern({ cmd: 'initiate_payment' })
  async initiatePayment(data: {
    bookingId: string;
    address1: string;
    address2: string;
    city: string;
  }) {
    return this.payHereService.buildCheckoutPayload({
      bookingId: data.bookingId,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
    });
  }

  @MessagePattern({ cmd: 'payment_notify' })
  async handleNotification(data: PayHereNotifyDTO) {
    await this.payHereService.handlePaymentNotification(data);
    return { status: 'received' };
  }

  @MessagePattern({ cmd: 'refund_booking' })
  async refundBooking(data: { paymentId: string; reason: string }) {
    return this.payHereService.refundBooking(data.paymentId, data.reason);
  }
}
