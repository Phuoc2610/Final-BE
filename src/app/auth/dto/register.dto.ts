import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDTO{
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
    firstName: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName :string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;
}