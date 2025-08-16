import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { PaymentGatewayProvider, PaymentStatus } from "..";
import { ConfigService } from "@nestjs/config";
import {
  PixPaymentPayload,
  CardPaymentPayload,
  BoletoPaymentPayload,
} from "../interfaces/payloads";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { SDKPaymentResponse } from "../interfaces/responses";

@Injectable()
export class MercadoPagoService implements PaymentGatewayProvider {
  private readonly client: MercadoPagoConfig;
  private readonly payment: Payment;

  public constructor(private readonly configService: ConfigService) {
    this.client = new MercadoPagoConfig({
      accessToken: this.configService.get<string>("mp.accessToken")!,
    });
    this.payment = new Payment(this.client);
  }

  public async getPixPayment(
    order: string,
    payload: PixPaymentPayload,
  ): Promise<SDKPaymentResponse> {
    try {
      return await this.payment.create({
        body: {
          ...payload,
          payment_method_id: "pix",
          external_reference: order,
        },
        requestOptions: { idempotencyKey: `${order}:pix` },
      });
    } catch (e) {
      Logger.error(e, "MercadoPagoService");
      throw new InternalServerErrorException(
        "Erro ao processar pagamento com pix, tente novamente mais tarde",
      );
    }
  }

  public async getCardPayment(
    order: string,
    payload: CardPaymentPayload,
  ): Promise<SDKPaymentResponse> {
    try {
      return await this.payment.create({
        body: { ...payload, external_reference: order },
        requestOptions: { idempotencyKey: `${order}:card` },
      });
    } catch (e) {
      Logger.error(e, "MercadoPagoService");
      throw new InternalServerErrorException(
        "Erro ao processar pagamento com cartão, tente novamente mais tarde",
      );
    }
  }

  public async getBoletoPayment(
    order: string,
    payload: BoletoPaymentPayload,
  ): Promise<SDKPaymentResponse> {
    try {
      return await this.payment.create({
        body: {
          ...payload,
          payment_method_id: "bolbradesco",
          external_reference: order,
        },
        requestOptions: { idempotencyKey: `${order}:boleto` },
      });
    } catch (e) {
      Logger.error(e, "MercadoPagoService");
      throw new InternalServerErrorException(
        "Erro ao processar pagamento com boleto, tente novamente mais tarde",
      );
    }
  }

  public async getStatus(id: string): Promise<PaymentStatus> {
    const payment = await new Payment(this.client).get({
      id,
    });

    return {
      approved: payment.status == "approved",
      order: payment.external_reference ?? "",
      method: payment.payment_type_id ?? "",
      value: payment.transaction_amount ?? 0,
    };
  }
}
