import {MigrationInterface, QueryRunner} from "typeorm";

export class addCancelledByToAppointment1596511339720 implements MigrationInterface {
    name = 'addCancelledByToAppointment1596511339720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ADD "cancelled_by" character varying DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "cancelled_by"`);
    }

}
