import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Status {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

@Entity({ name: "tb_agents" })
export class Agente {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 250, nullable: false })
    name: string

    @Column({ length: 250, nullable: false })
    description: string

    @Column({ name: "system_prompt", nullable: false })
    systemPrompt: string

    @Column({ name: "max_tokens_per_execution", type: "int", nullable: false})
    maxTokensPerExecution: number

    @Column({ name: "monthly_token_limit", type: "int", nullable: false})
    monthlyTokenLimit: number

    @Column({ type: "enum", enum: Status, default: Status.ACTIVE})
    status: Status
}