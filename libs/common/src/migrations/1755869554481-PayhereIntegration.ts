import { MigrationInterface, QueryRunner } from 'typeorm';

export class PayhereIntegration1755869554481 implements MigrationInterface {
  name = 'PayhereIntegration1755869554481';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`phone\` varchar(10) NOT NULL DEFAULT '0701111111'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` ADD \`amount\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_details\` CHANGE \`status\` \`status\` enum ('PAID', 'FAILED', 'REFUNDED', 'PENDING', 'CANCELLED') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`payment_details\` CHANGE \`status\` \`status\` enum ('PAID', 'FAILED', 'REFUNDED') NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`bookings\` DROP COLUMN \`amount\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`phone\``);
  }
}
