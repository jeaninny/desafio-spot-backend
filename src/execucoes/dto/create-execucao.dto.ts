import { IsInt, IsNotEmpty, IsString, Min } from "class-validator"

export class CreateExecucaoDto {

    @IsString()
    @IsNotEmpty()
    readonly inputMessage: string

    @IsString()
    @IsNotEmpty()
    readonly outputMessage: string

    @IsInt()
    @Min(0)    
    readonly inputTokens: number

    @IsInt()
    @Min(0)    
    readonly outputTokens: number

    @IsInt()
    @Min(0)
    readonly executionTimeMs: number

    @IsInt()
    @Min(1)
    readonly agentId: number
}