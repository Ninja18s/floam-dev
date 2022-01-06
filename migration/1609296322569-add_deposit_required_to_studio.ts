import {MigrationInterface, QueryRunner} from "typeorm";

export class addDepositRequiredToStudio1609296322569 implements MigrationInterface {
    name = 'addDepositRequiredToStudio1609296322569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studio" ADD "deposit_required" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "deposit_required"`);
    }

}
