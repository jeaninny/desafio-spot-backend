import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { LoginDto } from '../dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Autenticação")
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiOperation({
    summary: 'Autentica usuário e retorna token JWT'
  })
  login(@Body() user: LoginDto): Promise<any> {
    return this.authService.login(user);
  }
}
