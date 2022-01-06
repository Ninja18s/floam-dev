import {MigrationInterface, QueryRunner} from "typeorm";

export class upgradeAppointmentAndReviewObjects1590358648651 implements MigrationInterface {
    name = 'upgradeAppointmentAndReviewObjects1590358648651'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_81446f2ee100305f42645d4d6c2"`, undefined);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "user_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "host_left_review" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "artist_left_review" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ADD "private_comment" character varying(600) DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ADD "appointment_id" uuid NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ADD "left_by_user_type" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ADD "left_by_user_id" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_903e62f543f7d13c3ee258dbc56"`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "studio_id" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_903e62f543f7d13c3ee258dbc56" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_0d93cb313f7d6575ce870300ac1" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_0d93cb313f7d6575ce870300ac1"`, undefined);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_903e62f543f7d13c3ee258dbc56"`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "studio_id" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_903e62f543f7d13c3ee258dbc56" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "left_by_user_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "left_by_user_type"`, undefined);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "appointment_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "private_comment"`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "artist_left_review"`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "host_left_review"`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ADD "user_id" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_81446f2ee100305f42645d4d6c2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
