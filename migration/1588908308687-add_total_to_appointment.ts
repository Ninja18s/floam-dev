import {MigrationInterface, QueryRunner} from "typeorm";

export class addTotalToAppointment1588908308687 implements MigrationInterface {
    name = 'addTotalToAppointment1588908308687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ADD "total" numeric DEFAULT 0`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "total"`, undefined);
    }

}
