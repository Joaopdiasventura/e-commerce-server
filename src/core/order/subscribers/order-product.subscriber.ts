import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { Product } from "../../product/entities/product.entity";
import { OrderProduct } from "../entities/order-product.entity";

@EventSubscriber()
export class OrderProductSubscriber
  implements EntitySubscriberInterface<OrderProduct>
{
  public constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  public listenTo(): typeof OrderProduct {
    return OrderProduct;
  }

  public async afterInsert(event: InsertEvent<OrderProduct>): Promise<void> {
    const entity = event.entity;
    if (!entity?.product?.id || !entity.quantity) return;
    await event.manager.decrement(
      Product,
      { id: entity.product.id },
      "quantity",
      entity.quantity,
    );
  }
}
