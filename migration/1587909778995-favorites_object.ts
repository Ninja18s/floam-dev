import {MigrationInterface, QueryRunner} from "typeorm";

export class favoritesObject1587909778995 implements MigrationInterface {
    name = 'favoritesObject1587909778995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "favorite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "studio_id" uuid, CONSTRAINT "REL_e666fc7cc4c80fba1944daa1a7" UNIQUE ("user_id"), CONSTRAINT "REL_adb1721705e98b86fce23b2f09" UNIQUE ("studio_id"), CONSTRAINT "PK_495675cec4fb09666704e4f610f" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_e666fc7cc4c80fba1944daa1a74" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_adb1721705e98b86fce23b2f090" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_adb1721705e98b86fce23b2f090"`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_e666fc7cc4c80fba1944daa1a74"`, undefined);
        await queryRunner.query(`DROP TABLE "favorite"`, undefined);
    }

}
