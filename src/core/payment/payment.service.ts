import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import type { PaymentGatewayProvider } from "./providers";
import { OrderService } from "../order/order.service";
import {
  BoletoPaymentPayload,
  CardPaymentPayload,
  PixPaymentPayload,
} from "./providers/interfaces/payloads";
import { SDKPaymentResponse } from "./providers/interfaces/responses";
import { Message } from "../../shared/interfaces/messages/message";
import { PaymentGateway } from "./payment.gateway";
import type { PaymentRepository } from "./repositories/payment.repository";

@Injectable()
export class PaymentService {
  public constructor(
    @Inject("IPaymentRepository")
    private readonly paymentRepository: PaymentRepository,
    @Inject("PaymentGatewayProvider")
    private readonly paymentGatewayProvider: PaymentGatewayProvider,
    private readonly paymentGateway: PaymentGateway,
    private readonly orderService: OrderService,
  ) {}

  public async create({ data }: CreatePaymentDto): Promise<Message> {
    const paymentStatus = await this.paymentGatewayProvider.getStatus(data.id);
    if (!paymentStatus.approved)
      throw new UnauthorizedException("Pagamento não aprovado");
    this.paymentGateway.orderPaid(paymentStatus.order);
    data = { ...data, ...paymentStatus };
    await this.paymentRepository.create({ data });
    return { message: "Pagamento realizado com sucesso" };
  }

  public async getPixPayment(
    orderId: string,
    payload: PixPaymentPayload,
  ): Promise<SDKPaymentResponse> {
    if (await this.paymentRepository.findByOrder(orderId))
      throw new BadRequestException("Pagamento já realizado para este pedido");

    const order = await this.orderService.findById(orderId);
    payload.transaction_amount = order.value / 100;
    payload.payer = { email: "" };

    if (order.user) payload.payer.email = order.user.email;
    return this.paymentGatewayProvider.getPixPayment(orderId, payload);
  }

  public async getCardPayment(
    orderId: string,
    payload: CardPaymentPayload,
  ): Promise<SDKPaymentResponse> {
    if (await this.paymentRepository.findByOrder(orderId))
      throw new BadRequestException("Pagamento já realizado para este pedido");

    if (!payload.token) throw new BadRequestException("token ausente");
    const order = await this.orderService.findById(orderId);

    payload.transaction_amount = order.value / 100;
    if (order.user) payload.payer = { email: order.user.email };
    if (!payload.installments) payload.installments = 1;
    else payload.installments = parseInt("" + payload.installments);

    return this.paymentGatewayProvider.getCardPayment(orderId, payload);
  }

  public async getBoletoPayment(
    orderId: string,
    payload: BoletoPaymentPayload,
  ): Promise<SDKPaymentResponse> {
    if (await this.paymentRepository.findByOrder(orderId))
      throw new BadRequestException("Pagamento já realizado para este pedido");

    const order = await this.orderService.findById(orderId);
    payload.transaction_amount = order.value / 100;

    if (!payload.cpf)
      throw new BadRequestException(
        "CPF é obrigatório para pagamento com boleto",
      );

    if (order.user) {
      const names = order.user.name.split(" ");
      payload.payer = {
        email: order.user.email,
        identification: { type: "CPF", number: payload.cpf },
        first_name: names[0],
        last_name: names[names.length - 1],
        address: {
          street_name: order.user.address.streetName,
          street_number: order.user.address.streetName,
          zip_code: order.user.address.zipCode,
          federal_unit: order.user.address.federalUnit,
          city: order.user.address.city,
          neighborhood: order.user.address.neighborhood,
        },
      };
    }

    delete payload.cpf;

    if (!payload.installments) payload.installments = 1;
    else payload.installments = parseInt("" + payload.installments);
    return this.paymentGatewayProvider.getBoletoPayment(orderId, payload);
  }
}
