import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private bcrypt: Bcrypt,
  ) {}

  async findById(id: number): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as Usuario;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async create(usuario: CreateUsuarioDto): Promise<Usuario> {
    const user = await this.findByEmail(usuario.email);

    if (user) {
      throw new BadRequestException('O Usuario já existe');
    }
    const hashedPassword = await this.bcrypt.hashPassword(usuario.password);
    const userToSave = { ...usuario, password: hashedPassword };

    const { password, ...userWithoutPassword } = await this.usuarioRepository.save(userToSave);
    return userWithoutPassword as Usuario;
  }

  async update(id: number, usuario: UpdateUsuarioDto): Promise<Usuario> {
    if (!id || id <= 0) {
      throw new BadRequestException('O Id do Usuário é inválido!');
    }

    const existingUser = await this.findById(id);

    let userToSave = { ...existingUser, ...usuario };

    if (usuario.password) {
      const newHashedPassword = await this.bcrypt.hashPassword(usuario.password);
      userToSave = { ...existingUser, ...usuario, password: newHashedPassword };
    }
    const { password, ...userWithoutPassword } = await this.usuarioRepository.save(userToSave);
    return userWithoutPassword as Usuario;
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);
    return await this.usuarioRepository.delete(id);
  }
}
