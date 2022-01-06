import {MigrationInterface, QueryRunner} from "typeorm";

export class addPushTokenToUser1596479403549 implements MigrationInterface {
    name = 'addPushTokenToUser1596479403549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "push_token" character varying DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "push_token"`);
    }

}
