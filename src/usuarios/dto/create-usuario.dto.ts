import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty()
  readonly password: string;
}
