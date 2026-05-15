import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Status {
    ATIVO = "ativo",
    INATIVO = "inativo"
}

@Entity({ name: "tb_agentes" })
export class Agente {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 250, nullable: false })
    nome: string

    @Column({ length: 250, nullable: false })
    descricao: string

    @Column({ name: "prompt_principal", nullable: false })
    promptPrincipal: string

    @Column({ name: "max_tokens_execucao", type: "int", nullable: false})
    maxTokensExecucao: number

    @Column({ name: "limite_mensal_tokens", type: "int", nullable: false})
    limiteMensalTokens: number

    @Column({ type: "enum", enum: Status, default: Status.ATIVO})
    status: Status
}