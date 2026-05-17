import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ExecucaoService } from '../services/execucao.service';
import { CreateExecucaoDto } from '../dto/create-execucao.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('/executions')
export class ExecucaoController {
  constructor(private readonly execucaoService: ExecucaoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.execucaoService.findAll();
  }

  @Get('/efficiency-ranking')
  @HttpCode(HttpStatus.OK)
  efficiencyRanking() {
    return this.execucaoService.efficiencyRanking();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.execucaoService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() execucao: CreateExecucaoDto) {
    return this.execucaoService.create(execucao);
  }
}
