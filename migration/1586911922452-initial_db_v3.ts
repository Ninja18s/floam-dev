import {MigrationInterface, QueryRunner} from "typeorm";

export class initialDbV31586911922452 implements MigrationInterface {
    name = 'initialDbV31586911922452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "address_one" character varying NOT NULL, "address_two" character varying, "state" character varying NOT NULL, "city" character varying NOT NULL, "zip_code" character varying NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "password" character varying NOT NULL, "first_name" character varying(200) NOT NULL, "last_name" character varying(200) NOT NULL, "email" character varying(100) NOT NULL, "phone" character varying(50) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "amenity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL, "description" character varying NOT NULL, "icon_name" character varying, "studio_id" uuid, CONSTRAINT "PK_f981de7b1a822823e5f31da10dc" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "studio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(200) NOT NULL, "state" text NOT NULL, "description" character varying(500) NOT NULL, "rules" character varying(500) NOT NULL, "price" double precision NOT NULL, "capacity" integer NOT NULL, "location_id" uuid, "user_id" uuid, CONSTRAINT "REL_067eefeee721b7cbf5b5349947" UNIQUE ("location_id"), CONSTRAINT "PK_4c17ecb2b175322407ebbaef5c7" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "appointment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "start" TIMESTAMP NOT NULL, "end" TIMESTAMP NOT NULL, "studio_id" uuid, "user_id" uuid, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "src" text NOT NULL, "type" character varying(20) NOT NULL, "studio_id" uuid, "user_id" uuid, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "date" character varying NOT NULL, "start_time" character varying NOT NULL, "end_time" character varying NOT NULL, "timezone" character varying NOT NULL, "studio_id" uuid, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "rating" double precision NOT NULL, "comment" character varying(600) NOT NULL, "studio_id" uuid, "user_id" uuid, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "amenity" ADD CONSTRAINT "FK_07ae0b979fe1c2ec274de1e93a1" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ADD CONSTRAINT "FK_067eefeee721b7cbf5b5349947e" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" ADD CONSTRAINT "FK_a6b01c9eacf0888b25d8a72dbbd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_3c889a66a116ea3c6f0e10c461f" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_15d50a87502380623ff0c27e458" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_e53107478402327ffb3aeaea002" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_b0b068a2be3e9a2ed6052786781" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_2c817184f9e1d8426a9faadadcc" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_903e62f543f7d13c3ee258dbc56" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_81446f2ee100305f42645d4d6c2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_81446f2ee100305f42645d4d6c2"`, undefined);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_903e62f543f7d13c3ee258dbc56"`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_2c817184f9e1d8426a9faadadcc"`, undefined);
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_b0b068a2be3e9a2ed6052786781"`, undefined);
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_e53107478402327ffb3aeaea002"`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_15d50a87502380623ff0c27e458"`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_3c889a66a116ea3c6f0e10c461f"`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" DROP CONSTRAINT "FK_a6b01c9eacf0888b25d8a72dbbd"`, undefined);
        await queryRunner.query(`ALTER TABLE "studio" DROP CONSTRAINT "FK_067eefeee721b7cbf5b5349947e"`, undefined);
        await queryRunner.query(`ALTER TABLE "amenity" DROP CONSTRAINT "FK_07ae0b979fe1c2ec274de1e93a1"`, undefined);
        await queryRunner.query(`DROP TABLE "review"`, undefined);
        await queryRunner.query(`DROP TABLE "message"`, undefined);
        await queryRunner.query(`DROP TABLE "schedule"`, undefined);
        await queryRunner.query(`DROP TABLE "image"`, undefined);
        await queryRunner.query(`DROP TABLE "appointment"`, undefined);
        await queryRunner.query(`DROP TABLE "studio"`, undefined);
        await queryRunner.query(`DROP TABLE "amenity"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "location"`, undefined);
    }

}
