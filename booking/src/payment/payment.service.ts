// payhere.service.ts
import {
  BookingStatus,
  GenericError,
  getConfig,
  PaymentDetails,
  PaymentStatus,
} from '@charmbooking/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { BookingService } from 'src/booking/booking.service';
import { Repository } from 'typeorm';

const config = getConfig();

@Injectable()
export class PayHereService {
  constructor(
    private bookingService: BookingService,
    @InjectRepository(PaymentDetails)
    private paymentDetailsRepository: Repository<PaymentDetails>,
  ) {}

  generateMd5Hash(input: string): string {
    return crypto.createHash('md5').update(input).digest('hex').toUpperCase();
  }

  generateCheckoutHash({
    merchantId,
    orderId,
    amount,
    currency,
    merchantSecret,
  }: {
    merchantId: string;
    orderId: string;
    amount: string;
    currency: string;
    merchantSecret: string;
  }) {
    const secretMd5 = this.generateMd5Hash(merchantSecret);
    const raw = merchantId + orderId + amount + currency + secretMd5;
    return this.generateMd5Hash(raw);
  }

  async buildCheckoutPayload({
    bookingId,
    address1,
    address2,
    city,
  }: {
    bookingId: string;
    address1: string;
    address2: string;
    city: string;
  }) {
    const booking = await this.bookingService.findById(bookingId);
    if (!booking)
      throw new GenericError('Booking not found', HttpStatus.NOT_FOUND);
    const orderId = `${booking.id}-${Date.now()}`;
    const notifyURL = `${config.payHere.backendUrl}/payments/notify`;
    const user = booking.user;
    const merchantId = config.payHere.merchantId;
    const merchantSecret = config.payHere.merchantSecret;
    if (!merchantId || !merchantSecret) {
      throw new GenericError(
        'Payment configuration is missing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // Generate the hash
    const hash = this.generateCheckoutHash({
      merchantId,
      orderId,
      amount: booking.amount.toString(),
      currency: 'LKR',
      merchantSecret,
    });
    return {
      merchantId: config.payHere.merchantId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: [address1, address2].filter(Boolean).join(', '),
      city,
      country: 'LK',
      orderId,
      items: booking.salonService.name,
      currency: 'LKR',
      amount: booking.amount,
      notifyURL,
      hash,
    };
  }

  async handlePaymentNotification(body: {
    merchant_id: string;
    order_id: string;
    payment_id: string;
    payhere_amount: string;
    payhere_currency: string;
    status_code: string;
    md5sig: string;
    method: string;
  }) {
    // Extract POST params
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      method,
    } = body;

    const merchantSecret = config.payHere.merchantSecret;
    if (!merchantSecret) {
      throw new GenericError(
        'Merchant secret is missing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const localMd5Sig = this.generateCheckoutHash({
      merchantId: merchant_id,
      orderId: order_id,
      amount: payhere_amount,
      currency: payhere_currency,
      merchantSecret,
    });

    if (localMd5Sig !== md5sig) {
      throw new GenericError('Invalid signature', HttpStatus.BAD_REQUEST);
    }

    const bookingId = order_id.split('-')[0];
    const booking = await this.bookingService.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    let paymentStatus: PaymentStatus;
    switch (status_code) {
      case '2':
        booking.status = BookingStatus.CONFIRMED;
        paymentStatus = PaymentStatus.PAID;
        break;
      case '0':
        booking.status = BookingStatus.PENDING;
        paymentStatus = PaymentStatus.PENDING;
        break;
      case '-1':
        booking.status = BookingStatus.CANCELLED;
        paymentStatus = PaymentStatus.CANCELLED;
        break;
      case '-2':
        booking.status = BookingStatus.CANCELLED;
        paymentStatus = PaymentStatus.FAILED;
        break;
      default:
        paymentStatus = PaymentStatus.FAILED;
        booking.status = BookingStatus.CANCELLED;
    }

    // Update booking with payment details
    booking.payment_id = payment_id;
    booking.status = BookingStatus.CONFIRMED;
    await this.bookingService.update(booking.id, booking);

    const paymentDetails: Partial<PaymentDetails> = {
      transaction_reference: payment_id,
      amount: Number(payhere_amount),
      status: paymentStatus,
      paid_at: new Date(),
      payment_method: method,
    };

    // Save payment details
    const payment = this.paymentDetailsRepository.create(paymentDetails);
    await this.paymentDetailsRepository.save(payment);
  }
}
