import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SalonWorkerService } from './salon_worker.service';

@Controller('salon-worker')
export class SalonWorkerController {}
