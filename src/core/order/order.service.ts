import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import type { OrderRepository } from "./repositories/order.repository";
import { UserService } from "../user/user.service";
import { ProductService } from "../product/product.service";
import { Message } from "../../shared/interfaces/messages/message";
import { Order } from "./entities/order.entity";

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

    if (!createOrderDto.user.isVerified)
      throw new UnauthorizedException(
        "Valide seu usuário para criar um pedido",
      );

    if (!createOrderDto.user.address)
      throw new BadRequestException(
        "Você precisa adicionar um endereço antes de criar um pedido",
      );

    createOrderDto.value = 0;

    createOrderDto.products = await Promise.all(
      createOrderDto.products.map(async (p) => {
        p.product = await this.productService.findById(p.productId);

        if (p.product.quantity < p.quantity)
          throw new BadRequestException(
            `Quantidade insuficiente para o produto ${p.product.name}; Disponível: ${p.product.quantity}, Solicitado: ${p.quantity}`,
          );

        if (!p.product.seller)
          throw new NotFoundException("Vendedor não encontrado");

        if (p.product.seller.id == createOrderDto.user.id)
          throw new BadRequestException(
            "Você não pode comprar seus próprios produtos",
          );

        createOrderDto.value += p.product.price * p.quantity;
        return p;
      }),
    );

    await this.orderRepository.create(createOrderDto);
    return { message: "Pedido criado com sucesso" };
  }

  public async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundException("Pedido não encontrado");
    return order;
  }

  public findManyByUser(user: string): Promise<Order[]> {
    return this.orderRepository.findManyByUser(user);
  }

  public async delete(id: string): Promise<Message> {
    await this.findById(id);
    await this.orderRepository.delete(id);
    return { message: "Pedido deletado com sucesso" };
  }
}
