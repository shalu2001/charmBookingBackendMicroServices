import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1751738210908 implements MigrationInterface {
    name = 'InitialSchema1751738210908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`salon_category\` (\`categoryId\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`categoryId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_service\` (\`serviceId\` varchar(36) NOT NULL, \`salonId\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`duration\` int NOT NULL, \`bufferTime\` int NOT NULL, PRIMARY KEY (\`serviceId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`firstName\` varchar(100) NOT NULL, \`lastName\` varchar(100) NOT NULL, \`dateOfBirth\` date NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(100) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`isActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_review\` (\`reviewId\` int NOT NULL AUTO_INCREMENT, \`salonId\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`rating\` int NOT NULL, \`comment\` text NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`reviewId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`salonId\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`ownerName\` varchar(255) NOT NULL, \`location\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`longitude\` decimal(10,8) NOT NULL, \`latitude\` decimal(10,8) NOT NULL, \`serviceServiceId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_holiday\` (\`id\` int NOT NULL AUTO_INCREMENT, \`salonId\` varchar(255) NOT NULL, \`date\` date NOT NULL, \`description\` varchar(255) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_3dd76a48ddb0643bd628fca21e\` (\`salonId\`, \`date\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_weekly_hours\` (\`id\` int NOT NULL AUTO_INCREMENT, \`salon_id\` int NOT NULL, \`day_of_week\` enum ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL, \`open_time\` time NOT NULL, \`close_time\` time NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_service_hours\` (\`id\` int NOT NULL AUTO_INCREMENT, \`salon_service_id\` varchar(255) NOT NULL, \`day_of_week\` enum ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL, \`start_time\` time NOT NULL, \`end_time\` time NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`payment_method\` varchar(255) NOT NULL, \`amount\` decimal NOT NULL, \`status\` enum ('PAID', 'FAILED', 'REFUNDED') NOT NULL, \`transaction_reference\` varchar(255) NOT NULL, \`paid_at\` timestamp NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bookings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`salon_id\` varchar(255) NOT NULL, \`salon_service_id\` varchar(255) NOT NULL, \`payment_id\` int NOT NULL, \`booking_date\` date NOT NULL, \`start_time\` time NOT NULL, \`status\` enum ('PENDING', 'CONFIRMED', 'CANCELLED') NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_service_categories\` (\`serviceId\` varchar(36) NOT NULL, \`categoryId\` int NOT NULL, INDEX \`IDX_59b929b61bf2405789de038893\` (\`serviceId\`), INDEX \`IDX_9e5bf8dd3577b3bed524c07cb0\` (\`categoryId\`), PRIMARY KEY (\`serviceId\`, \`categoryId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`salon_review\` ADD CONSTRAINT \`FK_606d7c654c31cd8a17aed1a142b\` FOREIGN KEY (\`salonId\`) REFERENCES \`salon\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`salon_review\` ADD CONSTRAINT \`FK_38c82f4eb7c4fa13854d64421d4\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`salon_image\` ADD CONSTRAINT \`FK_55979b6047c07df77ee38d880dd\` FOREIGN KEY (\`salonId\`) REFERENCES \`salon\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`salon\` ADD CONSTRAINT \`FK_3a9f2c933226bd1136e3df2a57d\` FOREIGN KEY (\`serviceServiceId\`) REFERENCES \`salon_service\`(\`serviceId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`salon_holiday\` ADD CONSTRAINT \`FK_d3a006cf32943c3eb65373f57c2\` FOREIGN KEY (\`salonId\`) REFERENCES \`salon\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`salon_service_hours\` ADD CONSTRAINT \`FK_7c8752cf0134a24270fb2dcf72c\` FOREIGN KEY (\`salon_service_id\`) REFERENCES \`salon_service\`(\`serviceId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_64cd97487c5c42806458ab5520c\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_f53f5edf6bce876f575fca51d2e\` FOREIGN KEY (\`salon_id\`) REFERENCES \`salon\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_94922b515fa415a070a6091224a\` FOREIGN KEY (\`salon_service_id\`) REFERENCES \`salon_service\`(\`serviceId\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookings\` ADD CONSTRAINT \`FK_5c9bd37ff5ee2ad5dc0f5307c53\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payment_details\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`salon_service_categories\` ADD CONSTRAINT \`FK_59b929b61bf2405789de038893d\` FOREIGN KEY (\`serviceId\`) REFERENCES \`salon_service\`(\`serviceId\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`salon_service_categories\` ADD CONSTRAINT \`FK_9e5bf8dd3577b3bed524c07cb09\` FOREIGN KEY (\`categoryId\`) REFERENCES \`salon_category\`(\`categoryId\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`salon_service_categories\` DROP FOREIGN KEY \`FK_9e5bf8dd3577b3bed524c07cb09\``);
        await queryRunner.query(`ALTER TABLE \`salon_service_categories\` DROP FOREIGN KEY \`FK_59b929b61bf2405789de038893d\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_5c9bd37ff5ee2ad5dc0f5307c53\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_94922b515fa415a070a6091224a\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_f53f5edf6bce876f575fca51d2e\``);
        await queryRunner.query(`ALTER TABLE \`bookings\` DROP FOREIGN KEY \`FK_64cd97487c5c42806458ab5520c\``);
        await queryRunner.query(`ALTER TABLE \`salon_service_hours\` DROP FOREIGN KEY \`FK_7c8752cf0134a24270fb2dcf72c\``);
        await queryRunner.query(`ALTER TABLE \`salon_holiday\` DROP FOREIGN KEY \`FK_d3a006cf32943c3eb65373f57c2\``);
        await queryRunner.query(`ALTER TABLE \`salon\` DROP FOREIGN KEY \`FK_3a9f2c933226bd1136e3df2a57d\``);
        await queryRunner.query(`ALTER TABLE \`salon_image\` DROP FOREIGN KEY \`FK_55979b6047c07df77ee38d880dd\``);
        await queryRunner.query(`ALTER TABLE \`salon_review\` DROP FOREIGN KEY \`FK_38c82f4eb7c4fa13854d64421d4\``);
        await queryRunner.query(`ALTER TABLE \`salon_review\` DROP FOREIGN KEY \`FK_606d7c654c31cd8a17aed1a142b\``);
        await queryRunner.query(`DROP INDEX \`IDX_9e5bf8dd3577b3bed524c07cb0\` ON \`salon_service_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_59b929b61bf2405789de038893\` ON \`salon_service_categories\``);
        await queryRunner.query(`DROP TABLE \`salon_service_categories\``);
        await queryRunner.query(`DROP TABLE \`bookings\``);
        await queryRunner.query(`DROP TABLE \`payment_details\``);
        await queryRunner.query(`DROP TABLE \`salon_service_hours\``);
        await queryRunner.query(`DROP TABLE \`salon_weekly_hours\``);
        await queryRunner.query(`DROP INDEX \`IDX_3dd76a48ddb0643bd628fca21e\` ON \`salon_holiday\``);
        await queryRunner.query(`DROP TABLE \`salon_holiday\``);
        await queryRunner.query(`DROP TABLE \`salon\``);
        await queryRunner.query(`DROP TABLE \`salon_image\``);
        await queryRunner.query(`DROP TABLE \`salon_review\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`salon_service\``);
        await queryRunner.query(`DROP TABLE \`salon_category\``);
    }

}
