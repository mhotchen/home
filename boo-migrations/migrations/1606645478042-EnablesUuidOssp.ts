import {MigrationInterface, QueryRunner} from "typeorm";

export class EnablesUuidOssp1606645478042 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION "uuid-ossp" WITH SCHEMA public`)
    }

    public async down(): Promise<void> {
    }

}
