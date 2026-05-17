import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AgenteService } from '../services/agente.service';
import { CreateAgenteDto } from '../dto/create-agente.dto';
import { UpdateAgenteDto } from '../dto/update-agente.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Agentes')
@UseGuards(JwtAuthGuard)
@Controller('/agents')
@ApiBearerAuth()
export class AgenteController {
  constructor(private readonly agenteService: AgenteService) { }

  @Get()
  @ApiOperation({
    summary: 'Lista todos os agentes'
  })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.agenteService.findAll();
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Busca agente por ID'
  })
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.agenteService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Cadastra novo agente'
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() agente: CreateAgenteDto) {
    return this.agenteService.create(agente);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Atualiza agente'
  })
  @HttpCode(HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() agente: UpdateAgenteDto) {
    return this.agenteService.update(id, agente);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Remove agente'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.agenteService.delete(id);
  }
}
