import { Transform, TransformFnParams } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { Status } from "../entities/agente.entity";

export class CreateAgenteDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly name: string

    @IsString()
    @IsNotEmpty()
    readonly description: string

    @IsString()
    @IsNotEmpty()
    readonly systemPrompt: string

    @IsInt()
    @Min(0)
    readonly maxTokensPerExecution: number

    @IsInt()
    @Min(0)
    readonly monthlyTokenLimit: number

    @IsOptional()
    @IsEnum(Status)    
    readonly status: Status
}