import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePaymentAndReviewEntities1756634756761
  implements MigrationInterface
{
  name = 'UpdatePaymentAndReviewEntities1756634756761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`payment_details\` DROP COLUMN \`transaction_reference\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`salon_review\` ADD \`bookingId\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`salon_review\` ADD UNIQUE INDEX \`IDX_09aff426854869f771d5ec1dfd\` (\`bookingId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_5c9bd37ff5ee2ad5dc0f5307c53\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_details\` CHANGE \`id\` \`id\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`payment_details\` DROP PRIMARY KEY`);
    await queryRunner.query(
      `ALTER TABLE \`payment_details\` DROP COLUMN \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_details\` ADD \`id\` varchar(255) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` DROP COLUMN \`payment_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` ADD \`payment_id\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` CHANGE \`status\` \`status\` enum ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_09aff426854869f771d5ec1dfd\` ON \`salon_review\` (\`bookingId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_5c9bd37ff5ee2ad5dc0f5307c53\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payment_details\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`salon_review\` ADD CONSTRAINT \`FK_09aff426854869f771d5ec1dfdf\` FOREIGN KEY (\`bookingId\`) REFERENCES \`bookings\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`salon_review\` DROP FOREIGN KEY \`FK_09aff426854869f771d5ec1dfdf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_5c9bd37ff5ee2ad5dc0f5307c53\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_09aff426854869f771d5ec1dfd\` ON \`salon_review\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` CHANGE \`status\` \`status\` enum ('PENDING', 'CONFIRMED', 'CANCELLED') NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` DROP COLUMN \`payment_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` ADD \`payment_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_details\` DROP COLUMN \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_details\` ADD \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_details\` ADD PRIMARY KEY (\`id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_details\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_5c9bd37ff5ee2ad5dc0f5307c53\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payment_details\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`salon_review\` DROP INDEX \`IDX_09aff426854869f771d5ec1dfd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`salon_review\` DROP COLUMN \`bookingId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_details\` ADD \`transaction_reference\` varchar(255) NOT NULL`,
    );
  }
}
