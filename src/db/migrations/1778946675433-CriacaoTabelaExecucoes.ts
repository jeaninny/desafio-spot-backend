import { MigrationInterface, QueryRunner } from "typeorm";

export class CriacaoTabelaExecucoes1778946675433 implements MigrationInterface {
    name = 'CriacaoTabelaExecucoes1778946675433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tb_executions" ("id" SERIAL NOT NULL, "input_message" character varying NOT NULL, "output_message" character varying NOT NULL, "input_tokens" integer NOT NULL, "output_tokens" integer NOT NULL, "total_tokens" integer NOT NULL, "execution_time_ms" integer NOT NULL, "agentId" integer, CONSTRAINT "PK_5319b9cd39b9a3c500f00330bc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tb_executions" ADD CONSTRAINT "FK_86da6caedd0313a07224ee1434f" FOREIGN KEY ("agentId") REFERENCES "tb_agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_executions" DROP CONSTRAINT "FK_86da6caedd0313a07224ee1434f"`);
        await queryRunner.query(`DROP TABLE "tb_executions"`);
    }

}
