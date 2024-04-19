import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateOrderDTO } from "./create-order.dto";

export class UpdateOrderDTO extends PartialType(CreateOrderDTO){}