import * as bcrypt from 'bcrypt'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { User } from '../src/users/user.entity'

export class encryptUserPasswords1591665393797 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const users: User[] = await queryRunner.query(`SELECT * FROM "user";`)
        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10)
            await queryRunner.query(`UPDATE "user" SET password='${hashedPassword}' WHERE id='${user.id}';`)
        }
    }

    // tslint:disable-next-line:no-empty
    public async down(queryRunner: QueryRunner): Promise<any> {}
}
