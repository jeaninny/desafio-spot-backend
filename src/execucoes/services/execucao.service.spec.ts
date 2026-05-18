import { Test, TestingModule } from "@nestjs/testing";
import { ExecucaoService } from "./execucao.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Execucao } from "../entities/execucao.entity";
import { AgenteService } from "../../agentes/services/agente.service";
import { Repository } from "typeorm";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Status } from "../../agentes/entities/agente.entity";


describe('ExecucaoService', () => {
    let service: ExecucaoService;
    let execucaoRepository: jest.Mocked<Repository<Execucao>>;
    let agenteService: jest.Mocked<AgenteService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExecucaoService,
                {
                    provide: getRepositoryToken(Execucao),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        createQueryBuilder: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: AgenteService,
                    useValue: { findById: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<ExecucaoService>(ExecucaoService);
        execucaoRepository = module.get(getRepositoryToken(Execucao));
        agenteService = module.get(AgenteService);
    });

    it('1 - deve retornar todas as execuções', async () => {
        const mockExecutions = [
            { id: 1, inputTokens: 100, outputTokens: 200, totalTokens: 300, agent: { id: 1, name: 'agent' } },
            { id: 2, inputTokens: 50, outputTokens: 80, totalTokens: 130, agent: { id: 2, name: 'agent 2' } },
        ]

        jest.spyOn(execucaoRepository, 'find').mockResolvedValue(mockExecutions as any)
        const result = await service.findAll()
        expect(result).toEqual(mockExecutions)
    });

    it('2 - deve retornar lista vazia de execuções', async () => {
        const mockEmptyExecutions = []

        jest.spyOn(execucaoRepository, 'find').mockResolvedValue(mockEmptyExecutions as any)

        const result = await service.findAll()
        expect(result).toEqual(mockEmptyExecutions)

    });

    it('3 - deve retornar uma execução quando o id existe', async () => {
        const mockExecution = { id: 1, inputTokens: 100, outputTokens: 200, totalTokens: 300 }

        jest.spyOn(execucaoRepository, 'findOne').mockResolvedValue(mockExecution as any)

        const result = await service.findById(1)

        expect(result).toEqual(mockExecution)
    });

    it('4 - deve retornar NotFoundException para o caso em que o id não existe', async () => {
        jest.spyOn(execucaoRepository, 'findOne').mockResolvedValue(null)

        await expect(service.findById(1)).rejects.toThrow(NotFoundException)
    });

    it('5 - deve impedir agente inativo de registrar execuções', async () => {

        const mockAgent = {
            id: 1, name: 'agent',
            description: '',
            systemPrompt: '',
            maxTokensPerExecution: 330,
            monthlyTokenLimit: 6000,
            status: Status.INACTIVE
        }

        const mockDto = {
            inputMessage: 'teste',
            outputMessage: 'teste',
            inputTokens: 100,
            outputTokens: 100,
            executionTimeMs: 500,
            agentId: 1
        }

        jest.spyOn(agenteService, 'findById').mockResolvedValue(mockAgent as any)

        await expect(service.create(mockDto)).rejects.toThrow(BadRequestException)

    });

    it('6 - deve impedir que o total de tokens ultrapasse o limite máximo por execução do agente', async () => {

        const mockAgent = {
            id: 1, name: 'agent',
            description: '',
            systemPrompt: '',
            maxTokensPerExecution: 100,
            monthlyTokenLimit: 3000,
            status: Status.ACTIVE
        }

        const mockDto = {
            inputMessage: 'teste',
            outputMessage: 'teste',
            inputTokens: 100,
            outputTokens: 100,
            executionTimeMs: 500,
            agentId: 1
        }

        jest.spyOn(agenteService, 'findById').mockResolvedValue(mockAgent as any)

        await expect(service.create(mockDto)).rejects.toThrow(BadRequestException)

    });

    it('7 - deve impedir que o consumo acumulado no mês não ultrapasse o limite mensal definido para o agente', async () => {

        const mockAgent = {
            id: 1, name: 'agent',
            description: '',
            systemPrompt: '',
            maxTokensPerExecution: 300,
            monthlyTokenLimit: 3000,
            status: Status.ACTIVE
        }

        const mockDto = {
            inputMessage: 'teste',
            outputMessage: 'teste',
            inputTokens: 100,
            outputTokens: 100,
            executionTimeMs: 500,
            agentId: 1
        }

        const mockQueryBuilder = {
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ sumDbTokens: '5000' }),
        }

        jest.spyOn(agenteService, 'findById').mockResolvedValue(mockAgent as any)

        jest.spyOn(execucaoRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any)

        await expect(service.create(mockDto)).rejects.toThrow(BadRequestException)
    });

    it('8 - deve criar execução com sucesso', async () => {

        const mockAgent = {
            id: 1, name: 'agent',
            description: '',
            systemPrompt: '',
            maxTokensPerExecution: 300,
            monthlyTokenLimit: 3000,
            status: Status.ACTIVE
        }

        const mockDto = {
            inputMessage: 'teste',
            outputMessage: 'teste',
            inputTokens: 100,
            outputTokens: 100,
            executionTimeMs: 500,
            agentId: 1
        }

        const mockQueryBuilder = {
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ sumDbTokens: '100' }),
        }

        const mockExecution = {
            ...mockDto,
            agent: mockAgent,
            totalTokens: 200,
        }

        jest.spyOn(agenteService, 'findById').mockResolvedValue(mockAgent as any)
        jest.spyOn(execucaoRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any)
        jest.spyOn(execucaoRepository, 'create').mockReturnValue(mockExecution as any)
        jest.spyOn(execucaoRepository, 'save').mockResolvedValue(mockExecution as any)

        const result = await service.create(mockDto)
        expect(result.totalTokens).toBe(200)
        expect(result).toEqual(mockExecution)

    });

});