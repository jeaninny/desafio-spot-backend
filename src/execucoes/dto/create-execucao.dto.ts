import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateExecucaoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly inputMessage: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly outputMessage: string;

  @IsInt()
  @Min(0)
  @ApiProperty()
  readonly inputTokens: number;

  @IsInt()
  @Min(0)
  @ApiProperty()
  readonly outputTokens: number;

  @IsInt()
  @Min(0)
  @ApiProperty()
  readonly executionTimeMs: number;

  @IsInt()
  @Min(1)
  @ApiProperty()
  readonly agentId: number;
}
