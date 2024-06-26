import { Body, Controller, Delete, Param, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaymentDTO } from "./dto/payment.dto";
import { ConfirmPaymentDTO } from "./dto/confirm.payment.dto";

import { RolesGuard } from "src/common/guard/roles.guard";

import { GetUser } from "src/common/decorator/user.decorator";
import { UpdatePaymentIntentDTO } from "./dto/update.payment.dto";
import { Roles } from "src/common/decorator/roles.decorator";
import { MyJwtGuard } from "src/common/guard/jwt-auth.guard";
import { Role } from "src/common/enums/roles.enum";
@Controller('payment')
@ApiTags('Payment')
@ApiBearerAuth('JWT-auth')
@Roles(Role.User)
@UseGuards(MyJwtGuard, RolesGuard)

export class PaymentController{
    constructor(
        private paymentService: PaymentService
    ){}

    @Post('create-payment-intent')
    async createPaymentIntent(@Body() paymentDTO: PaymentDTO) {

        return await this.paymentService.createPaymentIntent(paymentDTO);
    }

    @Post('confirm')
    async confirmPayment(@GetUser('id') userId: string,@Body() confirmPaymentDTO: ConfirmPaymentDTO) {
      try {
        const confirmedPayment = await this.paymentService.confirmPaymentIntent(confirmPaymentDTO.orderId);
        return { message: 'Payment confirmed successfully', payment: confirmedPayment };
      } catch (error) {
        return { message: 'Error confirming payment'};
      }
    }

    @Patch(':paymentIntentId')
    async updatePaymentIntent(@Param('paymentIntentId')paymentIntentId: string, @Body() updatePaymentDTO: UpdatePaymentIntentDTO ){
      try {
        await this.paymentService.updatePaymentIntent(paymentIntentId, updatePaymentDTO.amount);
        return { message: 'Payment intent updated successfully' };
      } catch (error) {
        return { message: 'Error updating payment intent', error: error.message };
      }
    }

    @Delete('cancal-intent/:id')
    async cancelPaymentIntent(@Param('id') paymentIntentId: string){
        return await this.paymentService.deletePaymentIntent(paymentIntentId);
    }
}