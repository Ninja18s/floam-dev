import {MigrationInterface, QueryRunner} from "typeorm";

export class addCancelledAtToAppointments1591541721271 implements MigrationInterface {
    name = 'addCancelledAtToAppointments1591541721271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ADD "cancelled_at" TIMESTAMP DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "cancellation_reason" character varying DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "cancellation_reason"`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "cancelled_at"`, undefined);
    }

}
