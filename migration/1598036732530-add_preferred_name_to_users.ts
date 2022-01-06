import {MigrationInterface, QueryRunner} from "typeorm";

export class addPreferredNameToUsers1598036732530 implements MigrationInterface {
    name = 'addPreferredNameToUsers1598036732530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "artist_name" character varying DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "bio" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "bio" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "bio" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "bio" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "artist_name"`);
    }

}
