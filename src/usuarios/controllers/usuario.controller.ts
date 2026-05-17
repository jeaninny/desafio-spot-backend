import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Usuários')
@Controller('/users')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOperation({
    summary: 'Busca usuário por ID'
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Cadastra novo usuário'
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() usuario: CreateUsuarioDto) {
    return this.usuarioService.create(usuario);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @ApiOperation({
    summary: 'Atualiza usuário'
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() usuario: UpdateUsuarioDto) {
    return this.usuarioService.update(id, usuario);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @ApiOperation({
    summary: 'Remove usuário'
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.delete(id);
  }
}
