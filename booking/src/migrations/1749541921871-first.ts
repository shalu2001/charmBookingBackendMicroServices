import { MigrationInterface, QueryRunner } from "typeorm";

export class First1749541921871 implements MigrationInterface {
    name = 'First1749541921871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`salon_category\` (\`categoryId\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`categoryId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon_service\` (\`serviceId\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`duration\` int NOT NULL, PRIMARY KEY (\`serviceId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`salon\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`ownerName\` varchar(255) NOT NULL, \`location\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`website\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`salon\``);
        await queryRunner.query(`DROP TABLE \`salon_service\``);
        await queryRunner.query(`DROP TABLE \`salon_category\``);
    }

}
