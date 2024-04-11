import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProfileDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    fullName: string
    

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    gender: string



}
