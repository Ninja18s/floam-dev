import {MigrationInterface, QueryRunner} from "typeorm";

export class createCalendarsTable1604873360554 implements MigrationInterface {
    name = 'createCalendarsTable1604873360554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "calendar" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "studio_id" uuid NOT NULL, "auto_confirm_appts" boolean NOT NULL DEFAULT true, "events" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_2492fb846a48ea16d53864e3267" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "calendar" ADD CONSTRAINT "FK_7fd5e60abfdc4ec51b19a3c522a" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calendar" DROP CONSTRAINT "FK_7fd5e60abfdc4ec51b19a3c522a"`);
        await queryRunner.query(`DROP TABLE "calendar"`);
    }

}
