import {MigrationInterface, QueryRunner} from "typeorm";

export class updateLocationLatLng1599270397132 implements MigrationInterface {
    name = 'updateLocationLatLng1599270397132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "lat"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "lat" double precision DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "lng"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "lng" double precision DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "lng"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "lng" integer`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "lat"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "lat" integer`);
    }

}
