import { MigrationInterface, QueryRunner } from "typeorm";

export class CriacaoEntidadeAgente1778878887502 implements MigrationInterface {
    name = 'CriacaoEntidadeAgente1778878887502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tb_agentes_status_enum" AS ENUM('ativo', 'inativo')`);
        await queryRunner.query(`CREATE TABLE "tb_agentes" ("id" SERIAL NOT NULL, "nome" character varying(250) NOT NULL, "descricao" character varying(250) NOT NULL, "prompt_principal" character varying NOT NULL, "max_tokens_execucao" integer NOT NULL, "limite_mensal_tokens" integer NOT NULL, "status" "public"."tb_agentes_status_enum" NOT NULL DEFAULT 'ativo', CONSTRAINT "PK_69f28f777353159d043174da587" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tb_agentes"`);
        await queryRunner.query(`DROP TYPE "public"."tb_agentes_status_enum"`);
    }

}
