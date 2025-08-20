import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn,
} from 'typeorm';

export class AddSalonAdminAndWorker1755621261692 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create salon_admin table
    await queryRunner.createTable(
      new Table({
        name: 'salon_admin',
        columns: [
          {
            name: 'adminId',
            type: 'char',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          { name: 'email', type: 'varchar' },
          { name: 'password', type: 'varchar' },
          { name: 'salonId', type: 'char', length: '36', isNullable: false },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'salon_admin',
      new TableForeignKey({
        columnNames: ['salonId'],
        referencedTableName: 'salon',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Create salon_worker table
    await queryRunner.createTable(
      new Table({
        name: 'salon_worker',
        columns: [
          {
            name: 'workerId',
            type: 'char',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          { name: 'password', type: 'varchar' },
          { name: 'salonId', type: 'char', length: '36', isNullable: false },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'salon_worker',
      new TableForeignKey({
        columnNames: ['salonId'],
        referencedTableName: 'salon',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    //add worker_id to booking table
    await queryRunner.addColumn(
      'bookings',
      new TableColumn({
        name: 'worker_id',
        type: 'char',
        length: '36',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        columnNames: ['worker_id'],
        referencedTableName: 'salon_worker',
        referencedColumnNames: ['workerId'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key and column for worker_id in bookings
    const bookingsTable = await queryRunner.getTable('bookings');
    const workerForeignKey1 = bookingsTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('worker_id') !== -1,
    );
    if (workerForeignKey1) {
      await queryRunner.dropForeignKey('bookings', workerForeignKey1);
    }
    await queryRunner.dropColumn('bookings', 'worker_id');
    // Drop foreign key and table for salon_admin
    const salonAdminTable = await queryRunner.getTable('salon_admin');
    const foreignKey = salonAdminTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('salonId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('salon_admin', foreignKey);
    }
    await queryRunner.dropTable('salon_admin');

    //Drop foreign key and table salon_worker
    const salonWorkerTable = await queryRunner.getTable('salon_worker');
    const workerForeignKey = salonWorkerTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('salonId') !== -1,
    );
    if (workerForeignKey) {
      await queryRunner.dropForeignKey('salon_worker', workerForeignKey);
    }
    await queryRunner.dropTable('salon_worker');
  }
}
