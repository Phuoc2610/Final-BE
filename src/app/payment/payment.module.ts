import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { StripeService } from "src/provide/stripe/stripe.service";


@Module({
    imports:[],
    controllers:[PaymentController],
    providers:[PaymentService, StripeService]
})
export class PaymentModule{}