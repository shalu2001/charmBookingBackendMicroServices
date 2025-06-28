import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1751088734436 implements MigrationInterface {
    name = 'InitialSchema1751088734436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`salon_category\` (\`categoryId\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`categoryId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_service\` (\`serviceId\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`duration\` int NOT NULL, PRIMARY KEY (\`serviceId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(100) NOT NULL, \`lastName\` varchar(100) NOT NULL, \`dateOfBirth\` date NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(100) NOT NULL, \`role\` varchar(100) NOT NULL, \`token\` text NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`isActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_review\` (\`reviewId\` int NOT NULL AUTO_INCREMENT, \`salonId\` int NOT NULL, \`userId\` int NOT NULL, \`rating\` int NOT NULL, \`comment\` text NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`reviewId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`ownerName\` varchar(255) NOT NULL, \`location\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`website\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`longitude\` decimal(10,8) NOT NULL, \`latitude\` decimal(10,8) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_service_categories\` (\`serviceId\` int NOT NULL, \`categoryId\` int NOT NULL, INDEX \`IDX_59b929b61bf2405789de038893\` (\`serviceId\`), INDEX \`IDX_9e5bf8dd3577b3bed524c07cb0\` (\`categoryId\`), PRIMARY KEY (\`serviceId\`, \`categoryId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_services\` (\`salon_id\` int NOT NULL, \`service_id\` int NOT NULL, INDEX \`IDX_2a594c739b53c9066b9d675705\` (\`salon_id\`), INDEX \`IDX_d7924d20be498c5a43808d7e0d\` (\`service_id\`), PRIMARY KEY (\`salon_id\`, \`service_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`salon_review\` ADD CONSTRAINT \`FK_606d7c654c31cd8a17aed1a142b\` FOREIGN KEY (\`salonId\`) REFERENCES \`salon\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`salon_review\` ADD CONSTRAINT \`FK_38c82f4eb7c4fa13854d64421d4\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`salon_service_categories\` ADD CONSTRAINT \`FK_59b929b61bf2405789de038893d\` FOREIGN KEY (\`serviceId\`) REFERENCES \`salon_service\`(\`serviceId\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`salon_service_categories\` ADD CONSTRAINT \`FK_9e5bf8dd3577b3bed524c07cb09\` FOREIGN KEY (\`categoryId\`) REFERENCES \`salon_category\`(\`categoryId\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`salon_services\` ADD CONSTRAINT \`FK_2a594c739b53c9066b9d6757059\` FOREIGN KEY (\`salon_id\`) REFERENCES \`salon\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`salon_services\` ADD CONSTRAINT \`FK_d7924d20be498c5a43808d7e0dc\` FOREIGN KEY (\`service_id\`) REFERENCES \`salon_service\`(\`serviceId\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`salon_services\` DROP FOREIGN KEY \`FK_d7924d20be498c5a43808d7e0dc\``);
        await queryRunner.query(`ALTER TABLE \`salon_services\` DROP FOREIGN KEY \`FK_2a594c739b53c9066b9d6757059\``);
        await queryRunner.query(`ALTER TABLE \`salon_service_categories\` DROP FOREIGN KEY \`FK_9e5bf8dd3577b3bed524c07cb09\``);
        await queryRunner.query(`ALTER TABLE \`salon_service_categories\` DROP FOREIGN KEY \`FK_59b929b61bf2405789de038893d\``);
        await queryRunner.query(`ALTER TABLE \`salon_review\` DROP FOREIGN KEY \`FK_38c82f4eb7c4fa13854d64421d4\``);
        await queryRunner.query(`ALTER TABLE \`salon_review\` DROP FOREIGN KEY \`FK_606d7c654c31cd8a17aed1a142b\``);
        await queryRunner.query(`DROP INDEX \`IDX_d7924d20be498c5a43808d7e0d\` ON \`salon_services\``);
        await queryRunner.query(`DROP INDEX \`IDX_2a594c739b53c9066b9d675705\` ON \`salon_services\``);
        await queryRunner.query(`DROP TABLE \`salon_services\``);
        await queryRunner.query(`DROP INDEX \`IDX_9e5bf8dd3577b3bed524c07cb0\` ON \`salon_service_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_59b929b61bf2405789de038893\` ON \`salon_service_categories\``);
        await queryRunner.query(`DROP TABLE \`salon_service_categories\``);
        await queryRunner.query(`DROP TABLE \`salon\``);
        await queryRunner.query(`DROP TABLE \`salon_review\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`salon_service\``);
        await queryRunner.query(`DROP TABLE \`salon_category\``);
    }

}
