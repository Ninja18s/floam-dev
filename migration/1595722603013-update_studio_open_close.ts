import {MigrationInterface, QueryRunner} from "typeorm";

export class updateStudioOpenClose1595722603013 implements MigrationInterface {
    name = 'updateStudioOpenClose1595722603013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "studio_open"`);
        await queryRunner.query(`ALTER TABLE "studio" ADD "studio_open" TIMESTAMP DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "studio_close"`);
        await queryRunner.query(`ALTER TABLE "studio" ADD "studio_close" TIMESTAMP DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "studio_addons" ALTER COLUMN "price" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "cancelled_at" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "cancellation_reason" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "cancellation_reason" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "cancelled_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "studio_addons" ALTER COLUMN "price" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "studio_close"`);
        await queryRunner.query(`ALTER TABLE "studio" ADD "studio_close" date`);
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "studio_open"`);
        await queryRunner.query(`ALTER TABLE "studio" ADD "studio_open" date`);
    }

}
