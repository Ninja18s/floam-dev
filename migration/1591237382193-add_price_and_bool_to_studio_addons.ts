import {MigrationInterface, QueryRunner} from "typeorm";

export class addPriceAndBoolToStudioAddons1591237382193 implements MigrationInterface {
    name = 'addPriceAndBoolToStudioAddons1591237382193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studio_addons" ADD "price" integer DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "studio_addons" ADD "price_option" character varying NOT NULL DEFAULT 'INCLUDED'`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "studio_addons" DROP COLUMN "price_option"`, undefined);
        await queryRunner.query(`ALTER TABLE "studio_addons" DROP COLUMN "price"`, undefined);
    }

}
