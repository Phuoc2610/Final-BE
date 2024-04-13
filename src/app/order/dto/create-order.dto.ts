import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    storeId: string;
    
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    totalPrice: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    productId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId:string
}
