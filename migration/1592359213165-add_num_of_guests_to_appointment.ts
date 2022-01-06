import {MigrationInterface, QueryRunner} from "typeorm";

export class addNumOfGuestsToAppointment1592359213165 implements MigrationInterface {
    name = 'addNumOfGuestsToAppointment1592359213165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ADD "num_of_guests" integer NOT NULL DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "studio_addons" ALTER COLUMN "price" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "cancelled_at" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "cancellation_reason" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "cancellation_reason" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "cancelled_at" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "studio_addons" ALTER COLUMN "price" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "num_of_guests"`, undefined);
    }

}
