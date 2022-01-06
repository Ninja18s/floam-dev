import {MigrationInterface, QueryRunner} from "typeorm";

export class addStatusToAppt1605300583149 implements MigrationInterface {
    name = 'addStatusToAppt1605300583149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "cancelled_by"`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "cancelled_by_user_id" character varying DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "cancelled_by_user_id"`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "cancelled_by" character varying`);
    }

}
