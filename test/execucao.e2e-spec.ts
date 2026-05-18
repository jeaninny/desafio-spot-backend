import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from 'supertest';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule } from "../src/app.module";
import { App } from "supertest/types";

describe('Testes do Módulo Execuções', () => {

    let token: any;
    let executionId: any
    let activeAgentId: any;
    let inactiveAgentId: any;
    let limitedAgentId: any;
    let app: INestApplication<App>;


    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost',
                    port: 5432,
                    username: 'docker',
                    password: 'docker',
                    database: 'spot_test_jeaninny',
                    entities: [__dirname + "./../src/**/entities/*.entity.ts"],
                    synchronize: true,
                    dropSchema: true,
                }),
                AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        await request(app.getHttpServer())
            .post('/users')
            .send({
                name: 'Teste',
                email: 'teste@teste.com',
                password: 'hashedPassword123'
            })
            .expect(201);

        const loginAnswer = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'teste@teste.com',
                password: 'hashedPassword123'
            })
            .expect(200)
        token = loginAnswer.body.token;

        const answerActiveAgent = await request(app.getHttpServer())
            .post('/agents')
            .set('Authorization', `${token}`)
            .send({
                name: 'Agente Ativo',
                description: 'Agente ativo para testes',
                systemPrompt: 'Você é um assistente de testes.',
                maxTokensPerExecution: 500,
                monthlyTokenLimit: 5000
            })
            .expect(201);
        activeAgentId = answerActiveAgent.body.id

        const answerInactiveAgent = await request(app.getHttpServer())
            .post('/agents')
            .set('Authorization', `${token}`)
            .send({
                name: 'Agente Inativo',
                description: 'Agente inativo para testes',
                systemPrompt: 'Agente inativo.',
                maxTokensPerExecution: 500,
                monthlyTokenLimit: 5000,
                status: 'inactive'
            })
            .expect(201);
        inactiveAgentId = answerInactiveAgent.body.id

        const answerLimitedAgent = await request(app.getHttpServer())
            .post('/agents')
            .set('Authorization', `${token}`)
            .send({
                name: 'Agente Limite Mensal',
                description: 'Agente com limite mensal baixo para testes',
                systemPrompt: 'Agente para teste de limite mensal.',
                maxTokensPerExecution: 200,
                monthlyTokenLimit: 300
            })
            .expect(201);
        limitedAgentId = answerLimitedAgent.body.id
    });


    afterAll(async () => {
        await app.close();
    })

    it('1 - deve cadastrar uma execução válida (com token e agente ativo)', async () => {
        const answer = await request(app.getHttpServer())
            .post('/executions')
            .set('Authorization', `${token}`)
            .send({
                inputMessage: 'Como faço para resetar minha senha?',
                outputMessage: 'Para resetar sua senha, acesse as configurações.',
                inputTokens: 100,
                outputTokens: 150,
                executionTimeMs: 800,
                agentId: activeAgentId,
            })
            .expect(201);
        executionId = answer.body.id
    })

    it('2 - não deve cadastrar execução com agente inativo', async () => {
        await request(app.getHttpServer())
            .post('/executions')
            .set('Authorization', `${token}`)
            .send({
                inputMessage: 'Tentativa de execução com agente inativo.',
                outputMessage: 'Resposta do agente inativo.',
                inputTokens: 50,
                outputTokens: 80,
                executionTimeMs: 500,
                agentId: inactiveAgentId
            })
            .expect(400);
    })

    it('3 - não deve cadastrar execução quando total de tokens ultrapassa limite em milissegundos por execução', async () => {
        await request(app.getHttpServer())
            .post('/executions')
            .set('Authorization', `${token}`)
            .send({
                inputMessage: 'Mensagem que ultrapassa o limite.',
                outputMessage: 'Resposta que ultrapassa o limite.',
                inputTokens: 300,
                outputTokens: 300,
                executionTimeMs: 500,
                agentId: activeAgentId
            })
            .expect(400);
    })

    it('4 - não deve cadastrar execução quando consumo mensal ultrapassa limite mensal', async () => {
        await request(app.getHttpServer())
            .post('/executions')
            .set('Authorization', `${token}`)
            .send({
                inputMessage: 'Mensagem antes de ultrapassar o limite mensal.',
                outputMessage: 'Resposta que ultrapassa o limite.',
                inputTokens: 100,
                outputTokens: 100,
                executionTimeMs: 200,
                agentId: limitedAgentId
            })
            .expect(201);

        await request(app.getHttpServer())
            .post('/executions')
            .set('Authorization', `${token}`)
            .send({
                inputMessage: 'Mensagem que ultrapassa o limite mensal.',
                outputMessage: 'Resposta que ultrapassa o limite.',
                inputTokens: 100,
                outputTokens: 100,
                executionTimeMs: 200,
                agentId: limitedAgentId
            })
            .expect(400);
    })

    it('5 - não deve permitir cadastrar execução sem token', async () => {
        await request(app.getHttpServer())
            .post('/executions')
            .send({
                inputMessage: 'Como faço para resetar minha senha?',
                outputMessage: 'Para resetar sua senha, acesse as configurações.',
                inputTokens: 100,
                outputTokens: 150,
                executionTimeMs: 800,
                agentId: activeAgentId,
            })
            .expect(401);
    })

    it('6 - não deve permitir o cadastro de execução caso não encontre o agente', async () => {
        await request(app.getHttpServer())
            .post('/executions')
            .set('Authorization', `${token}`)
            .send({
                inputMessage: 'Teste com agente inexistente.',
                outputMessage: 'Resposta do teste que tenta cadastrar execução com agente inexistente.',
                inputTokens: 300,
                outputTokens: 300,
                executionTimeMs: 500,
                agentId: 99999
            })
            .expect(404);
    })

    it('7 - deve listar todas as execuções (com token)', async () => {
        return await request(app.getHttpServer())
            .get('/executions')
            .set('Authorization', `${token}`)
            .expect(200)
    })

    it('8 - deve buscar execução por ID (com token)', async () => {
        return await request(app.getHttpServer())
            .get(`/executions/${executionId}`)
            .set('Authorization', `${token}`)
            .expect(200)
    })

    it('9 - deve retornar erro ao não localizar execução por ID (com token)', async () => {
        return await request(app.getHttpServer())
            .get('/executions/99999')
            .set('Authorization', `${token}`)
            .expect(404)
    })

    it('10 - deve retornar ranking de eficiência', async () => {
        return await request(app.getHttpServer())
            .get('/executions/efficiency-ranking')
            .set('Authorization', `${token}`)
            .expect(200)
    })
})