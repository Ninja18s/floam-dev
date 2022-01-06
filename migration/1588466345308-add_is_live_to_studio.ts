import {MigrationInterface, QueryRunner} from "typeorm";

export class addIsLiveToStudio1588466345308 implements MigrationInterface {
    name = 'addIsLiveToStudio1588466345308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studio" ADD "is_live" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "is_live"`, undefined);
    }

}
