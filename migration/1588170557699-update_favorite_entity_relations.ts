import {MigrationInterface, QueryRunner} from "typeorm";

export class updateFavoriteEntityRelations1588170557699 implements MigrationInterface {
    name = 'updateFavoriteEntityRelations1588170557699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_e666fc7cc4c80fba1944daa1a74"`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_adb1721705e98b86fce23b2f090"`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "UQ_e666fc7cc4c80fba1944daa1a74"`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "REL_adb1721705e98b86fce23b2f09"`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_e666fc7cc4c80fba1944daa1a74" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_adb1721705e98b86fce23b2f090" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_adb1721705e98b86fce23b2f090"`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_e666fc7cc4c80fba1944daa1a74"`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "REL_adb1721705e98b86fce23b2f09" UNIQUE ("studio_id")`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "UQ_e666fc7cc4c80fba1944daa1a74" UNIQUE ("user_id")`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_adb1721705e98b86fce23b2f090" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_e666fc7cc4c80fba1944daa1a74" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
