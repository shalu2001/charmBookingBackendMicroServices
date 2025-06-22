import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSalonAndServiceTable1749568606121 implements MigrationInterface {
    name = 'UpdateSalonAndServiceTable1749568606121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`salon_services\` (\`salon_id\` int NOT NULL, \`service_id\` int NOT NULL, INDEX \`IDX_2a594c739b53c9066b9d675705\` (\`salon_id\`), INDEX \`IDX_d7924d20be498c5a43808d7e0d\` (\`service_id\`), PRIMARY KEY (\`salon_id\`, \`service_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`salon_services\` ADD CONSTRAINT \`FK_2a594c739b53c9066b9d6757059\` FOREIGN KEY (\`salon_id\`) REFERENCES \`salon\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`salon_services\` ADD CONSTRAINT \`FK_d7924d20be498c5a43808d7e0dc\` FOREIGN KEY (\`service_id\`) REFERENCES \`salon_service\`(\`serviceId\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`salon_services\` DROP FOREIGN KEY \`FK_d7924d20be498c5a43808d7e0dc\``);
        await queryRunner.query(`ALTER TABLE \`salon_services\` DROP FOREIGN KEY \`FK_2a594c739b53c9066b9d6757059\``);
        await queryRunner.query(`DROP INDEX \`IDX_d7924d20be498c5a43808d7e0d\` ON \`salon_services\``);
        await queryRunner.query(`DROP INDEX \`IDX_2a594c739b53c9066b9d675705\` ON \`salon_services\``);
        await queryRunner.query(`DROP TABLE \`salon_services\``);
    }

}
