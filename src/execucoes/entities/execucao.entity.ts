import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Agente } from '../../agentes/entities/agente.entity';

@Entity({ name: 'tb_executions' })
export class Execucao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'input_message', nullable: false })
  inputMessage: string;

  @Column({ name: 'output_message', nullable: false })
  outputMessage: string;

  @Column({ name: 'input_tokens', type: 'int', nullable: false })
  inputTokens: number;

  @Column({ name: 'output_tokens', type: 'int', nullable: false })
  outputTokens: number;

  @Column({ name: 'total_tokens', type: 'int', nullable: false })
  totalTokens: number;

  @Column({ name: 'execution_time_ms', type: 'int', nullable: false })
  executionTimeMs: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Agente, (agent) => agent.executions, {
    onDelete: 'CASCADE',
  })
  agent: Agente;
}
