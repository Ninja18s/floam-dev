import { MigrationInterface, QueryRunner } from 'typeorm';

export class changesInStudioAddOn1634621253160 implements MigrationInterface {
     name = 'changesInStudioAddOn1634621253160';

     public async up(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" DROP CONSTRAINT "FK_210956184473932df04bebb43e1"`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" DROP CONSTRAINT "FK_210956184473932df04bebb45c3"`
          );
          await queryRunner.query(
               `ALTER TABLE "support" DROP CONSTRAINT "FK_210956184473932df04bebb43e8"`
          );
          await queryRunner.query(
               `ALTER TABLE "support" DROP CONSTRAINT "FK_210956184473932df04bebb44c3"`
          );
          await queryRunner.query(
               `ALTER TABLE "userCard" DROP CONSTRAINT "FK_210956184473932df04bebb44d1"`
          );
          await queryRunner.query(
               `DROP INDEX "fki_FK_210956184473932df04bebb43e1"`
          );
          await queryRunner.query(
               `DROP INDEX "fki_FK_210956184473932df04bebb45c3"`
          );
          await queryRunner.query(
               `DROP INDEX "fki_FK_210956184473932df04bebb43e8"`
          );
          await queryRunner.query(
               `DROP INDEX "fki_FK_210956184473932df04bebb44d1"`
          );
          await queryRunner.query(
               `DROP INDEX "fki_FK_210956184473932df04bebb44c3"`
          );
          await queryRunner.query(
               `ALTER TABLE "location" ALTER COLUMN "lat" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "location" ALTER COLUMN "lng" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "password" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "first_name" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "last_name" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "doc_link" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "phone" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "date_of_birth" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "gender" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "ethnicity" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "bio" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "push_token" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "artist_name" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "facebook_id" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "google_id" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "apple_id" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "studio" DROP CONSTRAINT "FK_a6b01c9eacf0888b25d8a72dbbd"`
          );
          await queryRunner.query(
               `ALTER TABLE "studio" ALTER COLUMN "status" SET DEFAULT 'APPROVED'`
          );
          await queryRunner.query(
               `ALTER TABLE "studio" ALTER COLUMN "studio_open" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "studio" ALTER COLUMN "studio_close" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "studio" ALTER COLUMN "user_id" SET NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "studio_addons" ALTER COLUMN "price" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" DROP CONSTRAINT "FK_3c889a66a116ea3c6f0e10c461f"`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" DROP CONSTRAINT "FK_15d50a87502380623ff0c27e458"`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" ALTER COLUMN "studio_id" SET NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" ALTER COLUMN "user_id" SET NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" ALTER COLUMN "cancelled_at" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" ALTER COLUMN "cancellation_reason" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" ALTER COLUMN "cancelled_by_user_id" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "image" DROP CONSTRAINT "FK_b0b068a2be3e9a2ed6052786781"`
          );

          await queryRunner.query(
               `ALTER TABLE "paymentHistory" DROP COLUMN "user_id"`
          );

          await queryRunner.query(
               `ALTER TABLE "paymentHistory" ALTER COLUMN "amount" SET DEFAULT 0`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" ALTER COLUMN "status" DROP NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" ALTER COLUMN "status" SET DEFAULT null`
          );

          await queryRunner.query(
               `ALTER TABLE "paymentHistory" DROP COLUMN "appointment_id"`
          );

          await queryRunner.query(
               `ALTER TABLE "review" ALTER COLUMN "cleanliness_rating" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "review" ALTER COLUMN "timeliness_rating" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "review" ALTER COLUMN "communication_rating" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT null`
          );
          await queryRunner.query(
               `ALTER TABLE "userCard" ALTER COLUMN "brand" SET NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "UserNotification" ALTER COLUMN "type" SET NOT NULL`
          );

          await queryRunner.query(
               `ALTER TABLE "studio" ADD CONSTRAINT "FK_a6b01c9eacf0888b25d8a72dbbd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" ADD CONSTRAINT "FK_3c889a66a116ea3c6f0e10c461f" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" ADD CONSTRAINT "FK_15d50a87502380623ff0c27e458" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
          );
          await queryRunner.query(
               `ALTER TABLE "image" ADD CONSTRAINT "FK_b0b068a2be3e9a2ed6052786781" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
          );
          await queryRunner.query(
               `ALTER TABLE "support" ADD CONSTRAINT "FK_d53ceb941621665a8d6b1d1b186" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
          );
          await queryRunner.query(
               `ALTER TABLE "userCard" ADD CONSTRAINT "FK_ccc4081576e550a9a5701bad932" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
          );
     }

     public async down(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.query(
               `ALTER TABLE "userCard" DROP CONSTRAINT "FK_ccc4081576e550a9a5701bad932"`
          );
          await queryRunner.query(
               `ALTER TABLE "support" DROP CONSTRAINT "FK_d53ceb941621665a8d6b1d1b186"`
          );
          await queryRunner.query(
               `ALTER TABLE "image" DROP CONSTRAINT "FK_b0b068a2be3e9a2ed6052786781"`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" DROP CONSTRAINT "FK_15d50a87502380623ff0c27e458"`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" DROP CONSTRAINT "FK_3c889a66a116ea3c6f0e10c461f"`
          );
          await queryRunner.query(
               `ALTER TABLE "studio" DROP CONSTRAINT "FK_a6b01c9eacf0888b25d8a72dbbd"`
          );
          await queryRunner.query(
               `ALTER TABLE "UserNotification" ALTER COLUMN "entity_id" DROP NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "UserNotification" ALTER COLUMN "type" DROP NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "userCard" ALTER COLUMN "brand" DROP NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "review" ALTER COLUMN "private_comment" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "review" ALTER COLUMN "communication_rating" SET DEFAULT 0`
          );
          await queryRunner.query(
               `ALTER TABLE "review" ALTER COLUMN "timeliness_rating" SET DEFAULT 0`
          );
          await queryRunner.query(
               `ALTER TABLE "review" ALTER COLUMN "cleanliness_rating" SET DEFAULT 1`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" DROP COLUMN "appointment_id"`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" ADD "appointment_id" uuid`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" ALTER COLUMN "transaction_id" DROP NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" ALTER COLUMN "status" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" ALTER COLUMN "status" SET NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" ALTER COLUMN "amount" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" DROP COLUMN "user_id"`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" ADD "user_id" uuid NOT NULL`
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
               `ALTER TABLE "appointment" ALTER COLUMN "user_id" DROP NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" ALTER COLUMN "studio_id" DROP NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" ADD CONSTRAINT "FK_15d50a87502380623ff0c27e458" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
          );
          await queryRunner.query(
               `ALTER TABLE "appointment" ADD CONSTRAINT "FK_3c889a66a116ea3c6f0e10c461f" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
          );
          await queryRunner.query(
               `ALTER TABLE "studio_addons" ALTER COLUMN "price" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "studio" ALTER COLUMN "user_id" DROP NOT NULL`
          );
          await queryRunner.query(
               `ALTER TABLE "studio" ALTER COLUMN "studio_close" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "studio" ALTER COLUMN "studio_open" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "studio" ALTER COLUMN "status" SET DEFAULT 'PENDING_APPROVAL'`
          );
          await queryRunner.query(
               `ALTER TABLE "studio" ADD CONSTRAINT "FK_a6b01c9eacf0888b25d8a72dbbd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
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
               `ALTER TABLE "user" ALTER COLUMN "last_name" DROP DEFAULT`
          );
          await queryRunner.query(
               `ALTER TABLE "user" ALTER COLUMN "first_name" DROP DEFAULT`
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
               `CREATE INDEX "fki_FK_210956184473932df04bebb44c3" ON "UserNotification" ("user_id") `
          );
          await queryRunner.query(
               `CREATE INDEX "fki_FK_210956184473932df04bebb44d1" ON "userCard" ("user_id") `
          );
          await queryRunner.query(
               `CREATE INDEX "fki_FK_210956184473932df04bebb43e8" ON "support" ("user_id") `
          );
          await queryRunner.query(
               `CREATE INDEX "fki_FK_210956184473932df04bebb45c3" ON "paymentHistory" ("appointment_id") `
          );
          await queryRunner.query(
               `CREATE INDEX "fki_FK_210956184473932df04bebb43e1" ON "paymentHistory" ("user_id") `
          );
          await queryRunner.query(
               `ALTER TABLE "userCard" ADD CONSTRAINT "FK_210956184473932df04bebb44d1" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
          );
          await queryRunner.query(
               `ALTER TABLE "support" ADD CONSTRAINT "FK_210956184473932df04bebb44c3" FOREIGN KEY ("user_id", "user_id") REFERENCES "user"("id","id") ON DELETE NO ACTION ON UPDATE NO ACTION`
          );
          await queryRunner.query(
               `ALTER TABLE "support" ADD CONSTRAINT "FK_210956184473932df04bebb43e8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" ADD CONSTRAINT "FK_210956184473932df04bebb45c3" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
          );
          await queryRunner.query(
               `ALTER TABLE "paymentHistory" ADD CONSTRAINT "FK_210956184473932df04bebb43e1" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
          );
     }
}
