import {MigrationInterface, QueryRunner} from "typeorm";

export class addSexToUser1589403509673 implements MigrationInterface {
    name = 'addSexToUser1589403509673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "sex" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "sex"`, undefined);
    }

}
