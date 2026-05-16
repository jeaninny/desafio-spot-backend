import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Execucao } from "./entities/execucao.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Execucao])],
    controllers: [],
    providers: [],
    exports: [],
})

export class ExecucoesModule { }