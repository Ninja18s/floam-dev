import {MigrationInterface, QueryRunner} from "typeorm";

export class renameSexToGenderAddEthnicity1598364360692 implements MigrationInterface {
    name = 'renameSexToGenderAddEthnicity1598364360692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "sex" TO "gender"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "ethnicity" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "ethnicity"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "gender" TO "sex"`);
    }

}
