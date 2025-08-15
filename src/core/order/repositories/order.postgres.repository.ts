import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { Order } from "../entities/order.entity";
import { OrderProduct } from "../entities/order-product.entity";
import { OrderRepository } from "./order.repository";

export class PostgresOrderRepository implements OrderRepository {
  public constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,

    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
  ) {}

  public async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.repository.create(createOrderDto);
    return this.repository.save(order);
  }

  public findById(id: string): Promise<Order | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["products", "products.product", "user"],
    });
  }

  public findManyByUser(user: string): Promise<Order[]> {
    return this.repository.find({
      where: {
        user: { id: user },
      },
      relations: ["products", "products.product", "user"],
      order: {
        createdAt: "DESC",
      },
    });
  }

  public async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<void> {
    await this.repository.update(id, updateOrderDto);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
