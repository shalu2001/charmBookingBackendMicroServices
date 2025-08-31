import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UUID } from 'crypto';
import { firstValueFrom } from 'rxjs';

@Controller('salonWorker')
export class SalonWorkerController {
  constructor(
    @Inject('BOOKING_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post('createWorker')
  async create(@Body() createSalonWorkerDto: any) {
    return firstValueFrom(
      this.client.send({ cmd: 'create_salon_worker' }, createSalonWorkerDto),
    );
  }

  @Get('getWorkers/:salonId')
  async findOne(@Param('salonId') salonId: UUID): Promise<any> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_salon_workers' }, salonId),
    );
  }

  @Get('getWorkersByService/:serviceId')
  async findWorkersByService(
    @Param('serviceId') serviceId: UUID,
  ): Promise<any> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_workers_by_service' }, serviceId),
    );
  }

  @Post('/:salonId/addWorkerLeave/:workerId')
  async addWorkerLeave(
    @Param('salonId') salonId: UUID,
    @Param('workerId') workerId: UUID,
    @Body() leaveInputs: { date: Date; startTime: string; endTime: string }[],
  ): Promise<any> {
    return firstValueFrom(
      this.client.send(
        { cmd: 'add_salon_worker_leave' },
        { salonId, workerId, leaveInputs },
      ),
    );
  }

  @Get('/:salonId/getWorkersLeaves')
  async getWorkersLeaves(@Param('salonId') salonId: UUID): Promise<any> {
    return firstValueFrom(
      this.client.send({ cmd: 'get_salon_workers_leaves' }, salonId),
    );
  }

  //   @Post(':id')
  //   async update(@Param('id') id: string, @Body() updateSalonWorkerDto: any) {
  //     return firstValueFrom(this.client.send({ cmd: 'update_salon_worker' }, { id, ...updateSalonWorkerDto }));
  //   }

  //   @Delete(':id')
  //   async remove(@Param('id') id: string) {
  //     return firstValueFrom(this.client.send({ cmd: 'delete_salon_worker' }, id));
  //   }
}
