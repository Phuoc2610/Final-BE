import { ForbiddenException, Injectable } from "@nestjs/common";
import { Order } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { UpdateOrderDTO } from "./dto/update-order-dto";


@Injectable({})
export class OrderService {
    constructor(
        private prismaService: PrismaService,

    ) {
    }

    async findAll(): Promise<Order[]> {
        return await this.prismaService.order.findMany();
    }

    async findById(id: string): Promise<Order> {
        if (!id) {
            throw new ForbiddenException("Error Id:")
        }
        const Order = await this.prismaService.order.findUnique({
            where: {
                id: id
            },

        })
        if (!Order) {
            throw new ForbiddenException("Error Order")
        }
        return Order
    }
    async create(createOrderDTO: CreateOrderDTO): Promise<Order> {
        return await this.prismaService.order.create({
            data: {
                ...createOrderDTO
            }
        })
    }

    async update(id: string, updateCatgoryDTO: UpdateOrderDTO): Promise<Order> {
        const Order = await this.findById(id)
        if (!Order) {
            throw new ForbiddenException("Error id")
        }
        return await this.prismaService.order.update({
            where: {
                id: id
            },
            data: {
                ...updateCatgoryDTO
            }
        })
    }
    async deleteOrder(id: string): Promise<any> {
        const Order = await this.findById(id);
        // if(Order.)
        return await this.prismaService.order.delete({
            where: {
                id: id
            }
        })
    }
}