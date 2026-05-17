import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Agente } from '../entities/agente.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAgenteDto } from '../dto/create-agente.dto';
import { UpdateAgenteDto } from '../dto/update-agente.dto';

@Injectable()
export class AgenteService {
  constructor(
    @InjectRepository(Agente)
    private agenteRepository: Repository<Agente>,
  ) {}

  async findAll(): Promise<Agente[]> {
    return await this.agenteRepository.find();
  }

  async findById(id: number): Promise<Agente> {
    const agent = await this.agenteRepository.findOne({
      where: {
        id,
      },
    });

    if (!agent) {
      throw new NotFoundException('Agente não encontrado');
    }

    return agent;
  }

  async create(agent: CreateAgenteDto): Promise<Agente> {
    return await this.agenteRepository.save(agent);
  }

  async update(id: number, agent: UpdateAgenteDto): Promise<Agente> {
    if (!id || id <= 0) {
      throw new BadRequestException('O Id do Agente é inválido!');
    }

    const existingAgent = await this.findById(id);
    const agentToSave = { ...existingAgent, ...agent };
    return await this.agenteRepository.save(agentToSave);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);

    return await this.agenteRepository.delete(id);
  }
}
