import {MigrationInterface, QueryRunner} from "typeorm";

export class addFlaggedStudioEntity1588702108509 implements MigrationInterface {
    name = 'addFlaggedStudioEntity1588702108509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flagged_studios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "studio_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_5275377566f419a849dd562fa48" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "flagged_studios" ADD CONSTRAINT "FK_4e2afd30450b1790f958bc68ce0" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "flagged_studios" ADD CONSTRAINT "FK_e295a0057783a37ea9a39cb35c6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flagged_studios" DROP CONSTRAINT "FK_e295a0057783a37ea9a39cb35c6"`, undefined);
        await queryRunner.query(`ALTER TABLE "flagged_studios" DROP CONSTRAINT "FK_4e2afd30450b1790f958bc68ce0"`, undefined);
        await queryRunner.query(`DROP TABLE "flagged_studios"`, undefined);
    }

}
