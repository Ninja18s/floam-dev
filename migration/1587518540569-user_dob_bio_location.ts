import {MigrationInterface, QueryRunner} from "typeorm";

export class userDobBioLocation1587518540569 implements MigrationInterface {
    name = 'userDobBioLocation1587518540569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "date_of_birth" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "bio" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "location_id" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_37bfb01591406f0fefaed6799a0" UNIQUE ("location_id")`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "state"`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ADD "state" character varying NOT NULL DEFAULT 'PENDING_APPROVAL'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_37bfb01591406f0fefaed6799a0" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_37bfb01591406f0fefaed6799a0"`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "state"`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ADD "state" text NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_37bfb01591406f0fefaed6799a0"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "location_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "date_of_birth"`, undefined);
    }

}
