import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Execucao } from './entities/execucao.entity';
import { AgentesModule } from '../agentes/agentes.module';
import { ExecucaoService } from './services/execucao.service';
import { ExecucaoController } from './controllers/execucao.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Execucao]), AgentesModule],
  controllers: [ExecucaoController],
  providers: [ExecucaoService],
  exports: [],
})
export class ExecucoesModule {}
