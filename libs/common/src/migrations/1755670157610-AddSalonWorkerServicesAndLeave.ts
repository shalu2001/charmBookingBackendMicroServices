import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSalonWorkerServicesAndLeave1755670157610
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create join table for salon_worker and salon_service
    await queryRunner.query(`
            CREATE TABLE salon_worker_services (
                workerId char(36) NOT NULL,
                serviceId char(36) NOT NULL,
                PRIMARY KEY (workerId, serviceId),
                CONSTRAINT FK_worker FOREIGN KEY (workerId) REFERENCES salon_worker(workerId) ON DELETE CASCADE,
                CONSTRAINT FK_service FOREIGN KEY (serviceId) REFERENCES salon_service(serviceId) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `);

    // Create salon_worker_leave table
    await queryRunner.query(`
            CREATE TABLE salon_worker_leave (
                leaveId char(36) NOT NULL PRIMARY KEY,
                workerId char(36) NOT NULL,
                startDate date NOT NULL,
                endDate date NOT NULL,
                reason varchar(255),
                CONSTRAINT FK_leave_worker FOREIGN KEY (workerId) REFERENCES salon_worker(workerId) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop salon_worker_leave table
    await queryRunner.query('DROP TABLE IF EXISTS salon_worker_leave');

    // Drop join table for salon_worker and salon_service
    await queryRunner.query('DROP TABLE IF EXISTS salon_worker_services');
  }
}
