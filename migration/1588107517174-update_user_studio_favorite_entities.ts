import {MigrationInterface, QueryRunner} from "typeorm";

export class updateUserStudioFavoriteEntities1588107517174 implements MigrationInterface {
    name = 'updateUserStudioFavoriteEntities1588107517174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studio" RENAME COLUMN "state" TO "status"`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_e666fc7cc4c80fba1944daa1a74"`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" ALTER COLUMN "user_id" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "UQ_e666fc7cc4c80fba1944daa1a74" UNIQUE ("user_id")`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_e666fc7cc4c80fba1944daa1a74" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_e666fc7cc4c80fba1944daa1a74"`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "UQ_e666fc7cc4c80fba1944daa1a74"`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" ALTER COLUMN "user_id" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_e666fc7cc4c80fba1944daa1a74" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" RENAME COLUMN "status" TO "state"`, undefined);
    }

}
