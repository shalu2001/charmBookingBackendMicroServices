import { MigrationInterface, QueryRunner } from "typeorm";

export class SuperAdminVerify1756702481391 implements MigrationInterface {
    name = 'SuperAdminVerify1756702481391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_09aff426854869f771d5ec1dfd\` ON \`salon_review\``);
        await queryRunner.query(`CREATE TABLE \`super_admin\` (\`username\` varchar(100) NOT NULL, \`password\` varchar(100) NOT NULL, \`lastLoginTime\` timestamp NULL, \`loginFailedAttempts\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`username\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_documents\` (\`id\` varchar(36) NOT NULL, \`salonId\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`salon\` ADD \`isVerified\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`salon_documents\` ADD CONSTRAINT \`FK_be50671ba23d6b838daf8c9c2c6\` FOREIGN KEY (\`salonId\`) REFERENCES \`salon\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`salon_documents\` DROP FOREIGN KEY \`FK_be50671ba23d6b838daf8c9c2c6\``);
        await queryRunner.query(`ALTER TABLE \`salon\` DROP COLUMN \`isVerified\``);
        await queryRunner.query(`DROP TABLE \`salon_documents\``);
        await queryRunner.query(`DROP TABLE \`super_admin\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_09aff426854869f771d5ec1dfd\` ON \`salon_review\` (\`bookingId\`)`);
    }

}
