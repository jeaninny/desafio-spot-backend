import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionaDataCriacaoExecucao1778953565496 implements MigrationInterface {
    name = 'AdicionaDataCriacaoExecucao1778953565496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_executions" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_executions" DROP COLUMN "created_at"`);
    }

}
