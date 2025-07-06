import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveServiceFieldFromSalon1751790851112 implements MigrationInterface {
    name = 'RemoveServiceFieldFromSalon1751790851112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`salon\` DROP FOREIGN KEY \`FK_3a9f2c933226bd1136e3df2a57d\``);
        await queryRunner.query(`ALTER TABLE \`salon\` DROP COLUMN \`serviceServiceId\``);
        await queryRunner.query(`ALTER TABLE \`salon_service\` ADD CONSTRAINT \`FK_54f8e28e18214ba18a1eba96700\` FOREIGN KEY (\`salonId\`) REFERENCES \`salon\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`salon_service\` DROP FOREIGN KEY \`FK_54f8e28e18214ba18a1eba96700\``);
        await queryRunner.query(`ALTER TABLE \`salon\` ADD \`serviceServiceId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`salon\` ADD CONSTRAINT \`FK_3a9f2c933226bd1136e3df2a57d\` FOREIGN KEY (\`serviceServiceId\`) REFERENCES \`salon_service\`(\`serviceId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
