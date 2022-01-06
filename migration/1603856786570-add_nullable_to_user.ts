import {MigrationInterface, QueryRunner} from "typeorm";
import { IMAGE_TYPE } from '../src/entities/image.entity'

export class addNullableToUser1603856786570 implements MigrationInterface {
    name = 'addNullableToUser1603856786570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "status" character varying DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phone" DROP NOT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phone" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "date_of_birth" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "gender" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "ethnicity" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "bio" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "push_token" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "artist_name" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "image" ADD "type" character varying NULL`);
        await queryRunner.query(`UPDATE "image" SET type='${IMAGE_TYPE.STUDIO}' WHERE studio_id is not null;`)
        await queryRunner.query(`UPDATE "image" SET type='${IMAGE_TYPE.PROFILE}' WHERE user_id is not null;`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "artist_name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "push_token" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "bio" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "ethnicity" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "gender" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "date_of_birth" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phone" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phone" SET NOT null`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
    }

}
