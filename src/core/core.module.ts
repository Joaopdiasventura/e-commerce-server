import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [UserModule, ProductModule, OrderModule, PaymentModule, AddressModule],
})
export class CoreModule {}
