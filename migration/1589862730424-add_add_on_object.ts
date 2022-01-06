import {MigrationInterface, QueryRunner} from "typeorm";

export class addAddOnObject1589862730424 implements MigrationInterface {
    name = 'addAddOnObject1589862730424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "studio_addons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "studio_id" uuid NOT NULL, CONSTRAINT "PK_dbbcdb2b11d94726d1612e94f5e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ALTER COLUMN "description" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ALTER COLUMN "rules" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ALTER COLUMN "price" SET DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ALTER COLUMN "capacity" SET DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "studio_addons" ADD CONSTRAINT "FK_c2fa2f46da135c3d86e54d4973d" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studio_addons" DROP CONSTRAINT "FK_c2fa2f46da135c3d86e54d4973d"`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ALTER COLUMN "capacity" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ALTER COLUMN "price" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ALTER COLUMN "rules" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ALTER COLUMN "description" SET NOT NULL`, undefined);
        await queryRunner.query(`DROP TABLE "studio_addons"`, undefined);
    }

}
