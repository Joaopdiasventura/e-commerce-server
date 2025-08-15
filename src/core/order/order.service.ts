import { Inject, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import type { OrderRepository } from "./repositories/order.repository";
import { UserService } from "../user/user.service";
import { ProductService } from "../product/product.service";
import { Message } from "../../shared/interfaces/messages/message";

@Injectable()
export class OrderService {
  public constructor(
    @Inject("IOrderRepository")
    private readonly orderRepository: OrderRepository,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  public async create(createOrderDto: CreateOrderDto): Promise<Message> {
    createOrderDto.user = await this.userService.findById(
      createOrderDto.userId,
    );
    createOrderDto.products = await Promise.all(
      createOrderDto.products.map(async (product) => {
        product.product = await this.productService.findById(product.productId);
        return product;
      }),
    );
    await this.orderRepository.create(createOrderDto);
    return { message: "Pedido criado com sucesso" };
  }

  public async findAll() {
    return `This action returns all order`;
  }

  public async findById(id: string) {
    return `This action returns a #${id} order`;
  }

  public async update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  public async delete(id: string) {
    return `This action removes a #${id} order`;
  }
}
