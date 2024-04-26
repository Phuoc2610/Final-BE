import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetUser } from "src/common/decorator/user.decorator";
import { OrderService } from "./order.service";
import { MyJwtGuard } from "src/common/guard/jwt-auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { Roles } from "src/common/decorator/roles.decorator";
import { Role } from "src/common/enums/roles.enum";
import { CreateOrderDTO } from "./dto/create-order.dto";


@Controller('order')
@ApiTags('Order')
@ApiBearerAuth('JWT-auth')
@UseGuards(MyJwtGuard,RolesGuard)
export class OrderController{
    constructor(
        private readonly orderSerivce: OrderService
    ){

    }
    @Roles(Role.User)
    @Get()
    async getOrderByUser(@GetUser('id') id:string){
        return await this.orderSerivce.findByUserId(id)
    }

    @Get(':id')
    getById(@Param('id') id:string){
        return this.orderSerivce.findById(id)
    }
    @Roles(Role.User)
    @Post()
    async createOrder(@GetUser('id') id: string, @Body() createOrderDTO: CreateOrderDTO){
        return await this.orderSerivce.create(id , createOrderDTO)
    }
    
}