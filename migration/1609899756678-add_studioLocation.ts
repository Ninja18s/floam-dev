import {MigrationInterface, QueryRunner} from "typeorm";

export class addStudioLocation1609899756678 implements MigrationInterface {
    name = 'addStudioLocation1609899756678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studio" ADD "studio_location" character varying(500) DEFAULT 'Kitchen'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "studio_location"`);
    }

}
