import { Body, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { StripeService } from "src/provide/stripe/stripe.service";
import { PaymentDTO } from "./dto/payment.dto";
import { OrderStatus } from "@prisma/client";



@Injectable()
export class PaymentService {
    constructor(
        private prismaService: PrismaService,
        private stripeService: StripeService,
    ) { }

    async createPaymentIntent(@Body() paymentDTO: PaymentDTO) {

        try {
  
            const existingPaymentIntent = await this.stripeService.getPaymentIntentByOrderId(paymentDTO.orderId);
            const checkOrder = await this.prismaService.order.findUnique({
                where: {
                    id: paymentDTO.orderId,
                }
            })

            if (!checkOrder) {
                throw new ForbiddenException('Invalid id')
            }
            if (existingPaymentIntent) {
         
                if (existingPaymentIntent.status === 'requires_payment_method')
                    await this.updatePaymentIntent(existingPaymentIntent.id, paymentDTO.amount)
                return { clientSecret: existingPaymentIntent.client_secret }
            }
            const paymentIntent = await this.stripeService.createPaymentIntent(paymentDTO.amount, paymentDTO.currency, paymentDTO.orderId);
            return { clientSecret: paymentIntent.client_secret };
        } catch (error) {
            console.error("Error creating payment intent:", error);
            throw new Error('Error creating payment intent');
        }
    }

    async deletePaymentIntent(id: string) {
        try {
            await this.stripeService.cancelPaymentIntent(id);
            return { message: 'Payment intent canceled successfully' };
        } catch (error) {
            throw new Error('Error canceling payment intent');
        }
    }

    async updatePaymentIntent(paymentIntentId: string, amount: number) {
        try {
            const updatePaymentIntent = await this.stripeService.updatePaymentIntentPrice(paymentIntentId, amount)
            return updatePaymentIntent
        } catch (error) {
            throw new Error(`Error update faild: ${error.message}`)
        }
    }


    async confirmPaymentIntent(orderId: string) {
        console.log(orderId)
        try {
            const order = await this.prismaService.order.update({
                where: {
                    id: orderId
                },
                data: {
                    status: OrderStatus.PAYMENT
                },
                include: {
                    orderDetail: {
                        select: {
                            product: true
                        }
                    }
                }
            })
            return order
        } catch (error) {
            throw new Error(error)
        }
    }
}