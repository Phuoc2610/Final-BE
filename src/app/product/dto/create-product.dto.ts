import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    price: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    quantity: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    storeId: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    categoryid: string

}
