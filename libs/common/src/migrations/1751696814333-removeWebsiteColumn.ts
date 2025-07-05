import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveWebsiteColumn1751696814333 implements MigrationInterface {
    name = 'RemoveWebsiteColumn1751696814333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`salon\` DROP COLUMN \`website\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`salon\` ADD \`website\` varchar(255) NOT NULL`);
    }

}
