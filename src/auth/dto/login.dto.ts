import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}
