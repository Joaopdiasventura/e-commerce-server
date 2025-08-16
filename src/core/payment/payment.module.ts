import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { MercadoPagoService } from "./providers/mercado-pago/mercado-pago.service";
import { ConfigModule } from "@nestjs/config";
import { OrderModule } from "../order/order.module";
import { PaymentGateway } from "./payment.gateway";
import { PostgresPaymentRepository } from "./repositories/payment.postgres.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Payment]), OrderModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentGateway,
    PostgresPaymentRepository,
    { provide: "IPaymentRepository", useClass: PostgresPaymentRepository },
    { provide: "PaymentGatewayProvider", useClass: MercadoPagoService },
  ],
})
export class PaymentModule {}
