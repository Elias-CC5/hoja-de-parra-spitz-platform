import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccountLockoutToUsers1722000000000 implements MigrationInterface {
  name = 'AddAccountLockoutToUsers1722000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "failed_login_attempts" int NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "locked_until" timestamp NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "locked_until"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "failed_login_attempts"`);
  }
}