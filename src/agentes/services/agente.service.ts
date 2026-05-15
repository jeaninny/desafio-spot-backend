import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Agente } from "../entities/agente.entity";
import { DeleteResult, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAgenteDto } from "../dto/create-agente.dto";
import { UpdateAgenteDto } from "../dto/update-agente.dto";

@Injectable()
export class AgenteService {

    constructor(
        @InjectRepository(Agente)
        private agenteRepository: Repository<Agente>,
    ) { }

    async findAll(): Promise<Agente[]> {
        return this.agenteRepository.find()
    }

    async findById(id: number): Promise<Agente> {
        const agente = await this.agenteRepository.findOne({
            where: {
                id,
            }
        })

        if (!agente) {
            throw new NotFoundException('Agente não encontrado');
        }

        return agente
    }

    async create(agente: CreateAgenteDto): Promise<Agente> {
        return await this.agenteRepository.save(agente)
    }

    async update(id: number, agente: UpdateAgenteDto): Promise<Agente> {

        if (!id || id <= 0) {
            throw new BadRequestException("O Id do Agente é inválido!");
        }

        const agenteExistente = await this.findById(id)
        const agenteAtualizado = { ...agenteExistente, ...agente }
        return await this.agenteRepository.save(agenteAtualizado)
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findById(id)

        return await this.agenteRepository.delete(id)
    }
}