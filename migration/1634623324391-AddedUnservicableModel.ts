import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUnservicableModel1634623324391 implements MigrationInterface {
     name = 'AddedUnservicableModel1634623324391';

     public async up(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.query(
               `CREATE TABLE "unserviceableLocation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" character varying NOT NULL, "city" character varying NOT NULL, "zip_code" character varying NOT NULL, "lat" double precision DEFAULT null, "lng" double precision DEFAULT null, CONSTRAINT "PK_88d2b215edbb4fd4f1bdf480fa7" PRIMARY KEY ("id"))`
          );
     }

     public async down(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.query(
               `ALTER TABLE "image" DROP CONSTRAINT "FK_b0b068a2be3e9a2ed6052786781"`
          );
          await queryRunner.query(
               `ALTER TABLE "UserNotification" ALTER COLUMN "entity_id" DROP NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" ALTER COLUMN "transaction_id" DROP NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" ALTER COLUMN "status" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "image" ALTER COLUMN "user_id" DROP NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "image" ADD CONSTRAINT "FK_b0b068a2be3e9a2ed6052786781" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" ALTER COLUMN "cancelled_by_user_id" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" ALTER COLUMN "cancellation_reason" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" ALTER COLUMN "cancelled_at" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "studio_addons" ALTER COLUMN "price" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "studio" ALTER COLUMN "studio_close" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "studio" ALTER COLUMN "studio_open" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "apple_id" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "google_id" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "facebook_id" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "status" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "artist_name" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "push_token" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "bio" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "ethnicity" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "gender" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "date_of_birth" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "phone" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "doc_link" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "last_name" SET DEFAULT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "first_name" SET DEFAULT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "password" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "location" ALTER COLUMN "lng" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "location" ALTER COLUMN "lat" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" DROP COLUMN "appointment_id"`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" DROP COLUMN "user_id"`
          );
          await queryRunner.query(`DROP TABLE "unserviceableLocation"`);
     }
}
