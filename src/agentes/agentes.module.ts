import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Agente } from "./entities/agente.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Agente])],
    controllers: [],
    providers: [],
    exports: [],
})

export class AgentesModule { }