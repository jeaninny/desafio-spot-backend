import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Execucao } from '../entities/execucao.entity';
import { Repository } from 'typeorm';
import { CreateExecucaoDto } from '../dto/create-execucao.dto';
import { AgenteService } from '../../agentes/services/agente.service';
import { Agente, Status } from '../../agentes/entities/agente.entity';
import { endOfMonth, startOfMonth } from 'date-fns';

@Injectable()
export class ExecucaoService {
  constructor(
    @InjectRepository(Execucao)
    private execucaoRepository: Repository<Execucao>,
    private readonly agenteService: AgenteService,
  ) { }

  async findAll(): Promise<Execucao[]> {
    return await this.execucaoRepository.find({
      relations: {
        agent: true,
      },
    });
  }

  async findById(id: number): Promise<Execucao> {
    const execution = await this.execucaoRepository.findOne({
      where: {
        id,
      },
      relations: {
        agent: true,
      },
    });

    if (!execution) {
      throw new NotFoundException('Execução não encontrada');
    }

    return execution;
  }

  async create(execution: CreateExecucaoDto): Promise<Execucao> {
    const agent = await this.agenteService.findById(execution.agentId);

    const totalTokens = execution.inputTokens + execution.outputTokens;

    await this._validateExecution(agent, totalTokens);

    const executionToSave = this.execucaoRepository.create({
      ...execution,
      agent,
      totalTokens,
    });
    return await this.execucaoRepository.save(executionToSave);
  }

  async efficiencyRanking() {
    const orderedAgents = await this.execucaoRepository
      .createQueryBuilder('execution')
      .select('execution.agentId', 'agentId')
      .addSelect('SUM(execution.totalTokens)', 'sumOfAllTokens')
      .addSelect('COUNT(execution.id)', 'sumOfExecutionsPerAgent')
      .groupBy('execution.agentId')
      .addSelect('SUM(execution.totalTokens) / COUNT(execution.id)', 'averageTokens')
      .orderBy('SUM(execution.totalTokens) / COUNT(execution.id)', 'ASC')
      .getRawMany();

    return orderedAgents;
  }

  // Funções privadas

  private async _validateExecution(agent: Agente, totalTokens: number) {
    this._verifyAgentStatus(agent);
    this._validateTokenLimits(totalTokens, agent);
    await this._validateMonthlyTokenConsumption(totalTokens, agent);
  }

  private _verifyAgentStatus(agent: Agente) {
    if (agent.status === Status.INACTIVE) {
      throw new BadRequestException('Agentes inativos não podem registrar execuções');
    }
  }

  private _validateTokenLimits(totalTokens: number, agent: Agente) {
    if (totalTokens > agent.maxTokensPerExecution) {
      throw new BadRequestException('O total de tokens ultrapassa o limite máximo por execução do agente');
    }
  }

  private async _validateMonthlyTokenConsumption(totalTokens: number, agent: Agente) {
    const firstDayOfMonth = startOfMonth(new Date());
    const lastDayOfMonth = endOfMonth(new Date());

    const monthToDateConsumption = await this.execucaoRepository
      .createQueryBuilder('execution')
      .where('execution.agentId = :agentId', { agentId: agent.id })
      .andWhere('execution.createdAt >= :firstDayOfMonth AND execution.createdAt <= :lastDayOfMonth', {
        firstDayOfMonth,
        lastDayOfMonth,
      })
      .select('SUM(execution.totalTokens)', 'sumDbTokens')
      .getRawOne();

    const sumDbTokens = Number(monthToDateConsumption.sumDbTokens);

    if (sumDbTokens + totalTokens > agent.monthlyTokenLimit) {
      throw new BadRequestException(
        'O consumo acumulado no mês não pode ultrapassar o limite mensal definido para o agente',
      );
    }
  }
}
