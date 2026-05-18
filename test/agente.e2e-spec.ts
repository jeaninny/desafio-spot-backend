import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from 'supertest';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule } from "../src/app.module";
import { App } from "supertest/types";

describe('Testes do Módulo Agente', () => {

    let token: any;
    let agentId: any;
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
    });

    afterAll(async () => {
        await app.close();
    })

    it('1 - deve cadastrar um agente (com token)', async () => {
        const answer = await request(app.getHttpServer())
            .post('/agents')
            .set('Authorization', `${token}`)
            .send({
                name: 'Agente Teste',
                description: 'Agente para testes de integração',
                systemPrompt: 'Você é um assistente de testes.',
                maxTokensPerExecution: 1000,
                monthlyTokenLimit: 10000
            })
            .expect(201);
        agentId = answer.body.id
    })

    it('2 - deve listar todos os agentes (com token)', async () => {
        return await request(app.getHttpServer())
            .get('/agents')
            .set('Authorization', `${token}`)
            .expect(200)
    })

    it('3 - deve buscar agente por ID (com token)', async () => {
        return await request(app.getHttpServer())
            .get(`/agents/${agentId}`)
            .set('Authorization', `${token}`)
            .expect(200)
    })

    it('4 - deve retornar 404 para agente não encontrado', async () => {
        return await request(app.getHttpServer())
            .get('/agents/2')
            .set('Authorization', `${token}`)
            .expect(404)
    })

    it('5 - deve atualizar agente (com token)', async () => {
        return await request(app.getHttpServer())
            .patch(`/agents/${agentId}`)
            .set('Authorization', `${token}`)
            .send({
                name: 'Agente Teste Atualizado',
                description: 'Agente para testes de integração',
                systemPrompt: 'Você é um assistente de testes.',
                maxTokensPerExecution: 1000,
                monthlyTokenLimit: 10000
            })
            .expect(200);
    })

    it('6 - deve remover agente (com token) ', async () => {
        return await request(app.getHttpServer())
            .delete(`/agents/${agentId}`)
            .set('Authorization', `${token}`)
            .expect(204)
    })

    it('7 - não deve permitir acesso sem token', async () => {
        return await request(app.getHttpServer())
            .get('/executions')
            .expect(401)
    })

})