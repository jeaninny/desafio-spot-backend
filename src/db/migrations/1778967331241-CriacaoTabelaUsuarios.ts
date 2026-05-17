import { MigrationInterface, QueryRunner } from 'typeorm';

export class CriacaoTabelaUsuarios1778967331241 implements MigrationInterface {
  name = 'CriacaoTabelaUsuarios1778967331241';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tb_users" ("id" SERIAL NOT NULL, "name" character varying(250) NOT NULL, "email" character varying(250) NOT NULL, "password" character varying(250) NOT NULL, CONSTRAINT "UQ_142ce3112f446974f1c96a5d3ff" UNIQUE ("email"), CONSTRAINT "PK_a2c23e0679749c22ffa6c2be910" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tb_users"`);
  }
}
