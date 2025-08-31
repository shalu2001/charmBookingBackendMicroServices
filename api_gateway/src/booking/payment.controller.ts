import { PayHereNotifyDTO, PayHerePayload } from '@charmbooking/common';
import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('payments')
export class PaymentsController {
  constructor(@Inject('BOOKING_SERVICE') private client: ClientProxy) {}

  @Post('initiate')
  async initiatePayment(
    @Body()
    data: {
      bookingId: string;
      address1: string;
      address2: string;
      city: string;
    },
  ): Promise<PayHerePayload> {
    const pattern = { cmd: 'initiate_payment' };
    return firstValueFrom(this.client.send(pattern, data));
  }

  @Post('notify')
  async handleNotification(@Body() data: PayHereNotifyDTO): Promise<any> {
    const pattern = { cmd: 'payment_notify' };
    return firstValueFrom(this.client.send(pattern, data));
  }

  @Post('refund')
  async refundBooking(
    @Body() data: { bookingId: string; reason: string },
  ): Promise<any> {
    const pattern = { cmd: 'refund_booking' };
    return firstValueFrom(this.client.send(pattern, data));
  }
}
