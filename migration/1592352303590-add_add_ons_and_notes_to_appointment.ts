import {MigrationInterface, QueryRunner} from "typeorm";

export class addAddOnsAndNotesToAppointment1592352303590 implements MigrationInterface {
    name = 'addAddOnsAndNotesToAppointment1592352303590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appointment_add_ons" ("appointment_id" uuid NOT NULL, "add_on_id" uuid NOT NULL, CONSTRAINT "PK_b55a36dd63f9a1af1d3a10ccb1f" PRIMARY KEY ("appointment_id", "add_on_id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_695aaf6874aa9c5275be39e713" ON "appointment_add_ons" ("appointment_id") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_8258082117a5c90568752b7305" ON "appointment_add_ons" ("add_on_id") `, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "notes" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "studio_addons" ALTER COLUMN "price" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "cancelled_at" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "cancellation_reason" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment_add_ons" ADD CONSTRAINT "FK_695aaf6874aa9c5275be39e7135" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment_add_ons" ADD CONSTRAINT "FK_8258082117a5c90568752b73051" FOREIGN KEY ("add_on_id") REFERENCES "studio_addons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment_add_ons" DROP CONSTRAINT "FK_8258082117a5c90568752b73051"`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment_add_ons" DROP CONSTRAINT "FK_695aaf6874aa9c5275be39e7135"`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "private_comment" SET DEFAULT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "cancellation_reason" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "cancelled_at" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "studio_addons" ALTER COLUMN "price" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "notes"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_8258082117a5c90568752b7305"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_695aaf6874aa9c5275be39e713"`, undefined);
        await queryRunner.query(`DROP TABLE "appointment_add_ons"`, undefined);
    }

}
