import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsUsers1606646881542 implements MigrationInterface {

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table users
      (
        id uuid default uuid_generate_v4() not null primary key,
        cognito_sub uuid unique not null,
        organization_id uuid,
        email text not null,
        created timestamp default CURRENT_TIMESTAMP not null,
        unique (organization_id, email)
      )
    `)
  }

  public async down (): Promise<void> {
  }

}
