import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SalonWorkerService } from './salon_worker.service';
import { UUID } from 'crypto';

@Controller('salon-worker')
export class SalonWorkerController {
  constructor(private readonly salonWorkerService: SalonWorkerService) {}

  @MessagePattern({ cmd: 'create_salon_worker' })
  async createSalonWorker(data: any): Promise<any> {
    return this.salonWorkerService.createSalonWorker(data);
  }

  @MessagePattern({ cmd: 'get_salon_worker' })
  async getSalonWorker(salonId: UUID): Promise<any> {
    return this.salonWorkerService.getSalonWorker(salonId);
  }

  @MessagePattern({ cmd: 'get_workers_by_service' })
  async getWorkersByService(serviceId: UUID): Promise<any> {
    console.log('service id received:', serviceId);
    return this.salonWorkerService.getWorkersByService(serviceId);
  }

  @MessagePattern({ cmd: 'get_salon_workers' })
  async getSalonWorkers(salonId: UUID): Promise<any> {
    return this.salonWorkerService.getSalonWorkers(salonId);
  }

  @MessagePattern({ cmd: 'get_salon_worker_leaves' })
  async getSalonWorkerLeaves(salonId: UUID, workerId: UUID): Promise<any> {
    return this.salonWorkerService.getSalonWorkerLeaves(salonId, workerId);
  }

  @MessagePattern({ cmd: 'get_salon_workers_leaves' })
  async getSalonWorkersLeaves(salonId: UUID): Promise<any> {
    return this.salonWorkerService.getSalonWorkersLeaves(salonId);
  }

  @MessagePattern({ cmd: 'add_salon_worker_leave' })
  async addSalonWorkerLeave(data: any): Promise<any> {
    console.log('Received data for leave:', data);
    const { salonId, workerId, leaveInputs } = data;
    return this.salonWorkerService.addSalonWorkerLeave(
      salonId,
      workerId,
      leaveInputs.leaveInputs || leaveInputs,
    );
  }

  @MessagePattern({ cmd: 'update_salon_worker' })
  async updateSalonWorker(data: any): Promise<any> {
    return this.salonWorkerService.updateSalonWorker(data);
  }

  // @MessagePattern({ cmd: 'delete_salon_worker' })
  // async deleteSalonWorker(id: string): Promise<any> {
  //     return this.salonWorkerService.deleteSalonWorker(id);
  // }
}
