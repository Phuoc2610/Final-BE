import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'ex1@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}