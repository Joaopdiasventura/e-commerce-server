import { CreateOrderDto } from "../dto/create-order.dto";
import { Order } from "../entities/order.entity";

export interface OrderRepository {
  create(data: CreateOrderDto): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findManyByUser(user: string): Promise<Order[]>;
  delete(id: string): Promise<void>;
}
