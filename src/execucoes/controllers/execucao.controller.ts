import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ExecucaoService } from '../services/execucao.service';
import { CreateExecucaoDto } from '../dto/create-execucao.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Execuções')
@UseGuards(JwtAuthGuard)
@Controller('/executions')
@ApiBearerAuth()
export class ExecucaoController {
  constructor(private readonly execucaoService: ExecucaoService) { }

  @Get()
  @ApiOperation({
    summary: 'Lista todas as execuções'
  })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.execucaoService.findAll();
  }

  @Get('/efficiency-ranking')
  @ApiOperation({
    summary: 'Retorna ranking de eficiência dos agentes ordenados pela menor média de tokens consumidos por execução'
  })
  @HttpCode(HttpStatus.OK)
  efficiencyRanking() {
    return this.execucaoService.efficiencyRanking();
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Busca execução por ID'
  })
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.execucaoService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Cadastra nova execução'
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() execucao: CreateExecucaoDto) {
    return this.execucaoService.create(execucao);
  }
}
