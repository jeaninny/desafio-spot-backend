import { Repository } from "typeorm";
import { UsuarioService } from "./usuario.service"
import { getRepositoryToken } from "@nestjs/typeorm";
import { Usuario } from "../entities/usuario.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { Bcrypt } from "../../auth/bcrypt/bcrypt";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('UsuarioService', () => {

    let service: UsuarioService;
    let usuarioRepository: jest.Mocked<Repository<Usuario>>;
    let bcrypt: jest.Mocked<Bcrypt>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsuarioService,
                {
                    provide: getRepositoryToken(Usuario),
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: Bcrypt,
                    useValue: { hashPassword: jest.fn() },
                }
            ],
        }).compile();

        service = module.get<UsuarioService>(UsuarioService);
        usuarioRepository = module.get(getRepositoryToken(Usuario));
        bcrypt = module.get(Bcrypt);

    })

    it('1 - deve criar usuário com sucesso', async () => {

        const mockUser = {
            id: 1,
            name: 'Teste',
            email: 'teste@teste.com',
            password: 'hashedPassword123'
        }

        const mockDto = {
            name: 'Teste',
            email: 'teste@teste.com',
            password: 'hashedPassword123'
        }

        const expectedResult = {
            id: 1,
            name: 'Teste',
            email: 'teste@teste.com'
        }

        jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(null)
        jest.spyOn(bcrypt, 'hashPassword').mockResolvedValue('hashedPassword123')
        jest.spyOn(usuarioRepository, 'create').mockReturnValue(mockUser as any)
        jest.spyOn(usuarioRepository, 'save').mockResolvedValue(mockUser as any)

        const result = await service.create(mockDto)
        expect(result).toEqual(expectedResult)
    });

    it('2 - não deve criar usuário com email duplicado', async () => {

        const mockUser = {
            id: 1,
            name: 'Teste',
            email: 'teste@teste.com',
            password: 'hashedPassword123'
        }

        const mockDto = {
            name: 'Teste',
            email: 'teste@teste.com',
            password: 'hashedPassword123'
        }

        jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(mockUser as any)
        await expect(service.create(mockDto)).rejects.toThrow(BadRequestException)

    });

    it('3 - deve retornar NotFoundException para o caso em que o id não existe', async () => {
        jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(null)
        await expect(service.findById(1)).rejects.toThrow(NotFoundException)
    })
})