import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntities1756103741105 implements MigrationInterface {
    name = 'UpdateEntities1756103741105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` varchar(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`salon_worker_leave\` DROP COLUMN \`workerId\``);
        await queryRunner.query(`ALTER TABLE \`salon_worker_leave\` ADD \`workerId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`salon_weekly_hours\` DROP COLUMN \`salon_id\``);
        await queryRunner.query(`ALTER TABLE \`salon_weekly_hours\` ADD \`salon_id\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`salon_weekly_hours\` DROP COLUMN \`salon_id\``);
        await queryRunner.query(`ALTER TABLE \`salon_weekly_hours\` ADD \`salon_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`salon_worker_leave\` DROP COLUMN \`workerId\``);
        await queryRunner.query(`ALTER TABLE \`salon_worker_leave\` ADD \`workerId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` varchar(10) NOT NULL DEFAULT '0701111111'`);
    }

}
