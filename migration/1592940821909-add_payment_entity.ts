import {MigrationInterface, QueryRunner} from "typeorm";

export class addPaymentEntity1592940821909 implements MigrationInterface {
    name = 'addPaymentEntity1592940821909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "stripe_customer_id" character varying NOT NULL, "cards" jsonb NOT NULL, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payment"`, undefined);
    }

}
