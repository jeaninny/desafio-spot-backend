import { Transform, TransformFnParams } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { Status } from "../entities/agente.entity";

export class CreateAgenteDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly nome: string

    @IsString()
    @IsNotEmpty()
    readonly descricao: string

    @IsString()
    @IsNotEmpty()
    readonly promptPrincipal: string

    @IsInt()
    @Min(0)
    readonly maxTokensExecucao: number

    @IsInt()
    @Min(0)
    readonly limiteMensalTokens: number

    @IsOptional()
    @IsEnum(Status)    
    readonly status: Status
}