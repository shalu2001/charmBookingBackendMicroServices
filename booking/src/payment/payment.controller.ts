// payments.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PayHereService } from './payment.service';
import { PayHereNotifyDTO } from 'src/dto/paymentDto';

@Controller('payments')
export class PaymentsController {
  constructor(private payHereService: PayHereService) {}

  @Post('initiate')
  async initiatePayment(
    @Body()
    body: {
      bookingId: string;
      address1: string;
      address2: string;
      city: string;
    },
  ) {
    return this.payHereService.buildCheckoutPayload({
      bookingId: body.bookingId,
      address1: body.address1,
      address2: body.address2,
      city: body.city,
    });
  }

  @Post('notify')
  @HttpCode(HttpStatus.OK)
  async handleNotification(@Body() body: PayHereNotifyDTO) {
    await this.payHereService.handlePaymentNotification(body);
    return { status: 'received' };
  }

  @Post('refund')
  @HttpCode(HttpStatus.OK)
  async refundBooking(@Body() body: { paymentId: string; reason: string }) {
    return this.payHereService.refundBooking(body.paymentId, body.reason);
  }
}
