import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import type {
  BoletoPaymentPayload,
  CardPaymentPayload,
  PixPaymentPayload,
} from "./providers/interfaces/payloads";
import { SDKPaymentResponse } from "./providers/interfaces/responses";
import { Message } from "../../shared/interfaces/messages/message";

@Controller("payment")
export class PaymentController {
  public constructor(private readonly paymentService: PaymentService) {}

  @Post()
  public create(@Body() createPaymentDto: CreatePaymentDto): Promise<Message> {
    return this.paymentService.create(createPaymentDto);
  }

  @Get("pix/:orderId")
  public getPixPayment(
    @Param("orderId") orderId: string,
    @Query() payload: PixPaymentPayload,
  ): Promise<SDKPaymentResponse> {
    return this.paymentService.getPixPayment(orderId, payload);
  }

  @Get("card/:orderId")
  public getCardPayment(
    @Param("orderId") orderId: string,
    @Query() payload: CardPaymentPayload,
  ): Promise<SDKPaymentResponse> {
    return this.paymentService.getCardPayment(orderId, payload);
  }

  @Get("boleto/:orderId")
  public getBoletoPayment(
    @Param("orderId") orderId: string,
    @Query() payload: BoletoPaymentPayload,
  ): Promise<SDKPaymentResponse> {
    return this.paymentService.getBoletoPayment(orderId, payload);
  }
}
