import {MigrationInterface, QueryRunner} from "typeorm";

export class addNewFieldsToStudio1592680552660 implements MigrationInterface {
    name = 'addNewFieldsToStudio1592680552660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studio" ADD "genres" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ADD "artist_level" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ADD "studio_open" date DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ADD "studio_close" date DEFAULT null`, undefined);
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
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "studio_close"`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "studio_open"`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "artist_level"`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "genres"`, undefined);
    }

}
