import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agente } from './entities/agente.entity';
import { AgenteService } from './services/agente.service';
import { AgenteController } from './controllers/agente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Agente])],
  controllers: [AgenteController],
  providers: [AgenteService],
  exports: [AgenteService],
})
export class AgentesModule {}
