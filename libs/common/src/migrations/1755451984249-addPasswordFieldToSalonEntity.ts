import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordFieldToSalonEntity1755451984249 implements MigrationInterface {
    name = 'AddPasswordFieldToSalonEntity1755451984249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`salon\` ADD \`password\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`salon\` DROP COLUMN \`password\``);
    }

}
