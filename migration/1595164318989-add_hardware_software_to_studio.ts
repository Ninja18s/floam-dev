import {MigrationInterface, QueryRunner} from "typeorm";

export class addHardwareSoftwareToStudio1595164318989 implements MigrationInterface {
    name = 'addHardwareSoftwareToStudio1595164318989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studio" ADD "hardware" jsonb NOT NULL DEFAULT '[]'`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ADD "software" jsonb NOT NULL DEFAULT '[]'`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "rules"`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ADD "rules" jsonb NOT NULL DEFAULT '[]'`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ALTER COLUMN "studio_open" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ALTER COLUMN "studio_close" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studio" ALTER COLUMN "studio_close" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ALTER COLUMN "studio_open" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "rules"`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ADD "rules" character varying(500)`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "software"`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "hardware"`, undefined);
    }

}
