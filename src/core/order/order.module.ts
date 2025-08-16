import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { OrderProduct } from "./entities/order-product.entity";
import { UserModule } from "../user/user.module";
import { ProductModule } from "../product/product.module";
import { PostgresOrderRepository } from "./repositories/order.postgres.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderProduct]),
    UserModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    PostgresOrderRepository,
    {
      provide: "IOrderRepository",
      useClass: PostgresOrderRepository,
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}
