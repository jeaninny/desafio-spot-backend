import { MigrationInterface, QueryRunner } from "typeorm";

export class CriacaoTabelaAgentes1778943783265 implements MigrationInterface {
    name = 'CriacaoTabelaAgentes1778943783265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tb_agents_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "tb_agents" ("id" SERIAL NOT NULL, "name" character varying(250) NOT NULL, "description" character varying(250) NOT NULL, "system_prompt" character varying NOT NULL, "max_tokens_per_execution" integer NOT NULL, "monthly_token_limit" integer NOT NULL, "status" "public"."tb_agents_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "PK_cab30be2a84a3d87c342fa5d607" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tb_agents"`);
        await queryRunner.query(`DROP TYPE "public"."tb_agents_status_enum"`);
    }

}
