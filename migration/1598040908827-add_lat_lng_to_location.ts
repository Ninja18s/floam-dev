import {MigrationInterface, QueryRunner} from "typeorm";

export class addLatLngToLocation1598040908827 implements MigrationInterface {
    name = 'addLatLngToLocation1598040908827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ADD "lat" integer DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "location" ADD "lng" integer DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "lng"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "lat"`);
    }

}
