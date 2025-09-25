import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBookingEntity1755768641743 implements MigrationInterface {
    name = 'UpdateBookingEntity1755768641743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_5c9bd37ff5ee2ad5dc0f5307c53\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`payment_id\` \`payment_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_5c9bd37ff5ee2ad5dc0f5307c53\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payment_details\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_5c9bd37ff5ee2ad5dc0f5307c53\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`payment_id\` \`payment_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`bookings\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_5c9bd37ff5ee2ad5dc0f5307c53\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payment_details\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
