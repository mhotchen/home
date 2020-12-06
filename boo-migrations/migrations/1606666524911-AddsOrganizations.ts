import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsOrganizations1606666524911 implements MigrationInterface {

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table organizations
      (
        id uuid default uuid_generate_v4() not null primary key,
        name text not null,
        created timestamp default current_timestamp not null
      )
    `)
    await queryRunner.query(`
      alter table users
      add foreign key (organization_id) references organizations (id)
    `)
  }

  public async down (): Promise<void> {
  }

}
