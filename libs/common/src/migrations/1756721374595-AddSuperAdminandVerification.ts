import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSuperAdminandVerification1756721374595 implements MigrationInterface {
    name = 'AddSuperAdminandVerification1756721374595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_09aff426854869f771d5ec1dfd\` ON \`salon_review\``);
        await queryRunner.query(`CREATE TABLE \`super_admin\` (\`username\` varchar(100) NOT NULL, \`password\` varchar(100) NOT NULL, \`lastLoginTime\` timestamp NULL, \`loginFailedAttempts\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`username\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_documents\` (\`id\` varchar(36) NOT NULL, \`salonId\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`documentType\` enum ('ID_PROOF', 'BANKING_PROOF', 'COMPANY_REGISTRATION') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_details\` (\`salonId\` varchar(255) NOT NULL, \`owner_nic\` varchar(12) NOT NULL, \`bank_account_full_name\` varchar(255) NOT NULL, \`bank_account_number\` varchar(20) NOT NULL, \`bank_name\` varchar(255) NOT NULL, \`bank_branch\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`salonId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`salon\` ADD \`verificationStatus\` enum ('PENDING', 'VERIFIED', 'FAILED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`salon_documents\` ADD CONSTRAINT \`FK_be50671ba23d6b838daf8c9c2c6\` FOREIGN KEY (\`salonId\`) REFERENCES \`salon\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`salon_details\` ADD CONSTRAINT \`FK_d3633a3bd8abec7a44f59ee6c71\` FOREIGN KEY (\`salonId\`) REFERENCES \`salon\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`salon_details\` DROP FOREIGN KEY \`FK_d3633a3bd8abec7a44f59ee6c71\``);
        await queryRunner.query(`ALTER TABLE \`salon_documents\` DROP FOREIGN KEY \`FK_be50671ba23d6b838daf8c9c2c6\``);
        await queryRunner.query(`ALTER TABLE \`salon\` DROP COLUMN \`verificationStatus\``);
        await queryRunner.query(`DROP TABLE \`salon_details\``);
        await queryRunner.query(`DROP TABLE \`salon_documents\``);
        await queryRunner.query(`DROP TABLE \`super_admin\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_09aff426854869f771d5ec1dfd\` ON \`salon_review\` (\`bookingId\`)`);
    }

}
