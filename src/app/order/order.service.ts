import { ForbiddenException, Injectable } from "@nestjs/common";
import { Order, OrderStatus } from "@prisma/client";
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
            include:{
                orderDetail:{
                    include:{
                        product:true
                    }
                }
            }

        })
        return Order
    }

    async findByUserId(id: string): Promise<Order[]> {
        if (!id) {
            throw new ForbiddenException("Error Id:")
        }
        const Order = await this.prismaService.order.findMany({
            where: {
                userId: id
            },
            include:{
                orderDetail:{
                    select:{
                        id:true,
                        quantity:true,
                        price:true,
                        product:true
                    }
                }
            }

        })

        return Order
    }
    async create(id :string, createOrderDTO: CreateOrderDTO): Promise<Order> {

        const {price , quantity, productId, ...data} = createOrderDTO

        const checkOrder = await this.prismaService.order.findFirst({
            where:{
                userId:id,
                status: OrderStatus.PENDING,
            },
            include:{
                orderDetail:true
            }
        })
        const product = await this.prismaService.product.findUnique({
            where:{
                id: id
            }
        })
        if(product?.quantity <= 0  || quantity <= 0 ){
            throw new ForbiddenException({message: "error quantity"})
        }

        await this.prismaService.product.update({
            where: {
                id: productId
            },
            data: {
                quantity: {
                    decrement: quantity
                }
            }
        })
   
        if(checkOrder){

            const checkOrderDetail = await this.prismaService.orderDetails.findFirst({
                where:{
                    orderId: checkOrder.id,
                    productId: productId
                }
            })

            //truong hop 1 , khi san phan chua co trong orderdetail thi add them
            if(!checkOrderDetail){
                const newOrderDetails = await this.prismaService.orderDetails.create({
                    data:{
                        orderId: checkOrder.id,
                        productId: productId,
                        quantity: quantity,
                        price: price
                    }
                })

            }else{
                //co roi thi cap nhap lai don gia cua san pham
                const currentQuantity = checkOrderDetail.quantity + quantity
                const orderDetail = await this.prismaService.orderDetails.update({
                    where:{
                        id: checkOrderDetail?.id,
                        productId: productId
                    },
                    data:{
                        quantity: {
                            increment: quantity
                        },
                        price: price * currentQuantity
                    }
                })
            }

            const sumPrice = await this.totalPriceOrder(checkOrder.id)
            const order = await this.prismaService.order.update({
                where:{
                    id: checkOrder.id
                },
                data:{
                    totalPrice: sumPrice
                }
            })

            return order
            
        }
        //tao moi
        const order = await this.prismaService.order.create({
            data: {
                ...data,
                userId: id,
                totalPrice: price * quantity
            }
        })
    
        await this.prismaService.orderDetails.create({
            data: {
                orderId: order.id,
                quantity: quantity,
                productId: productId,
                price: price
            }
        })

        return order
    }
     async totalPriceOrder(id: string) : Promise<any>{
        let totalOrderPrice = 0;
        const orderDetailsPrice = await this.prismaService.orderDetails.findMany({
            where: {
                orderId: id
            }
        });

        for (const detail of orderDetailsPrice) {
            totalOrderPrice += detail.price;
        }

        return totalOrderPrice
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