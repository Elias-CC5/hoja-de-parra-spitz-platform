import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1721500000000 implements MigrationInterface {
  name = 'CreateUsersTable1721500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'empleado', 'cliente')`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'full_name', type: 'varchar', length: '120' },
          { name: 'email', type: 'varchar', length: '160', isUnique: true },
          { name: 'password', type: 'varchar' },
          { name: 'phone', type: 'varchar', length: '20', isNullable: true },
          {
            name: 'role',
            type: 'enum',
            enum: ['admin', 'empleado', 'cliente'],
            enumName: 'users_role_enum',
            default: `'cliente'`,
          },
          { name: 'is_active', type: 'boolean', default: true },
          {
            name: 'refresh_token_hash',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
