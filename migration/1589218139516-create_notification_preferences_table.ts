import {MigrationInterface, QueryRunner} from "typeorm";

export class createNotificationPreferencesTable1589218139516 implements MigrationInterface {
    name = 'createNotificationPreferencesTable1589218139516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification_preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "email" boolean NOT NULL DEFAULT true, "sms" boolean NOT NULL DEFAULT true, "push" boolean NOT NULL DEFAULT true, "user_id" uuid NOT NULL, CONSTRAINT "PK_e94e2b543f2f218ee68e4f4fad2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "FK_64c90edc7310c6be7c10c96f675" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "FK_64c90edc7310c6be7c10c96f675"`, undefined);
        await queryRunner.query(`DROP TABLE "notification_preferences"`, undefined);
    }

}
