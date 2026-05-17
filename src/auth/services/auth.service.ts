import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../../usuarios/services/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { Bcrypt } from '../bcrypt/bcrypt';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const searchUser = await this.usuarioService.findByEmail(email);

    if (!searchUser) return null;

    const matchPassword = await this.bcrypt.matchPassword(password, searchUser.password);

    if (matchPassword) {
      const { password, ...answer } = searchUser;
      return answer;
    }
    return null;
  }

  async login(userlogin: LoginDto) {
    const payload = { sub: userlogin.email };

    const searchUser = await this.usuarioService.findByEmail(userlogin.email);

    if (!searchUser) {
      throw new UnauthorizedException('Usuário inválido!');
    }

    return {
      id: searchUser.id,
      name: searchUser.name,
      email: userlogin.email,
      token: `Bearer ${this.jwtService.sign(payload)}`,
    };
  }
}
