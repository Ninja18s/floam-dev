import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserRelationToReview1590457783817 implements MigrationInterface {
    name = 'addUserRelationToReview1590457783817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "left_by_user_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ADD "left_by_user_id" uuid NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_f02390c6db48a87e4b5bc3363f0" FOREIGN KEY ("left_by_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_f02390c6db48a87e4b5bc3363f0"`, undefined);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "left_by_user_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ADD "left_by_user_id" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT NULL`, undefined);
    }

}
