import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { Order } from "../entities/order.entity";

export interface OrderRepository {
  create(data: CreateOrderDto): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findManyByUser(user: string): Promise<Order[]>;
  update(id: string, data: UpdateOrderDto): Promise<void>;
  delete(id: string): Promise<void>;
}
