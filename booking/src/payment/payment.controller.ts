// payments.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PayHereService } from './payment.service';

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
  async handleNotification(@Body() body: any) {
    // Delegate to service for verification and update
    await this.payHereService.handlePaymentNotification(body);
    // PayHere expects a 200 OK response
    return { status: 'received' };
  }
}
