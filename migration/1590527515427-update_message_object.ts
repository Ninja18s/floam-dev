import {MigrationInterface, QueryRunner} from "typeorm";

export class updateMessageObject1590527515427 implements MigrationInterface {
    name = 'updateMessageObject1590527515427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "sender_id" uuid NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ADD "receiver_id" uuid NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ADD "was_read" boolean NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_f4da40532b0102d51beb220f16a" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_f4da40532b0102d51beb220f16a"`, undefined);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6"`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "was_read"`, undefined);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "receiver_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "sender_id"`, undefined);
    }

}
