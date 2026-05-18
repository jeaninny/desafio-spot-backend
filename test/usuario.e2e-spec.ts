import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from 'supertest';
import { TypeOrmModule } from "@nestjs/typeorm";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";

describe('Testes dos Módulos Usuario e Auth (e2e)', () => {
    let token: any;
    let userId: any;

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
    });


    afterAll(async () => {
        await app.close();
    })

    it('1 - deve cadastrar um usuário', async () => {
        const answer = await request(app.getHttpServer())
            .post('/users')
            .send({
                name: 'Teste',
                email: 'teste@teste.com',
                password: 'hashedPassword123'
            })
            .expect(201);

        userId = answer.body.id;
    })

    it('2 - não deve cadastrar usuário com email duplicado', async () => {
        return await request(app.getHttpServer())
            .post('/users')
            .send({
                name: 'Teste',
                email: 'teste@teste.com',
                password: 'hashedPassword123'
            })
            .expect(400)
    })

    it('3 - deve autenticar o usuário (login) e salvar o token', async () => {
        const answer = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'teste@teste.com',
                password: 'hashedPassword123'
            })
            .expect(200)
        token = answer.body.token;
    })

    it('4 - deve buscar usuário por ID (com token)', async () => {
        return await request(app.getHttpServer())
            .get(`/users/${userId}`)
            .set('Authorization', `${token}`)
            .expect(200)
    })

    it('5 - deve atualizar usuário (com token)', async () => {
        return await request(app.getHttpServer())
            .patch(`/users/${userId}`)
            .set('Authorization', `${token}`)
            .send({
                name: 'Teste Atualizado',
                email: 'teste@teste.com',
                password: 'hashedPassword123'
            })
            .expect(200);
    })

    it('6 - não deve permitir acesso a endpoint protegido sem token', async () => {
        return await request(app.getHttpServer())
            .get('/executions')
            .expect(401)
    })

})