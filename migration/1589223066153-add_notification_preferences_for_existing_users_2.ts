import {MigrationInterface, QueryRunner} from "typeorm";

export class addNotificationPreferencesForExistingUsers21589223066153 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const messagesQuery = `insert into notification_preferences (created_at, updated_at, type, email, sms, push, user_id)
               select now(), now(), 'MESSAGES', true, true, true, id as user_id from "user"`
        const remindersQuery = `insert into notification_preferences (created_at, updated_at, type, email, sms, push, user_id)
               select now(), now(), 'REMINDERS', true, true, true, id as user_id from "user"`
        const promotionsQuery = `insert into notification_preferences (created_at, updated_at, type, email, sms, push, user_id)
               select now(), now(), 'PROMOTIONS', true, true, true, id as user_id from "user"`
        const supportQuery = `insert into notification_preferences (created_at, updated_at, type, email, sms, push, user_id)
               select now(), now(), 'SUPPORT', true, true, true, id as user_id from "user"`
        await queryRunner.query(messagesQuery, undefined);
        await queryRunner.query(remindersQuery, undefined);
        await queryRunner.query(promotionsQuery, undefined);
        await queryRunner.query(supportQuery, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`truncate notification_preferences;`, undefined);
    }

}
