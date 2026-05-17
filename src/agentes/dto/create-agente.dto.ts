import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Status } from '../entities/agente.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgenteDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly systemPrompt: string;

  @IsInt()
  @Min(0)
  @ApiProperty()
  readonly maxTokensPerExecution: number;

  @IsInt()
  @Min(0)
  @ApiProperty()
  readonly monthlyTokenLimit: number;

  @IsOptional()
  @IsEnum(Status)
  @ApiProperty()
  readonly status: Status;
}
