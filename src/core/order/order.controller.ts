import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Message } from "../../shared/interfaces/messages/message";
import { Order } from "./entities/order.entity";

@Controller("order")
export class OrderController {
  public constructor(private readonly orderService: OrderService) {}

  @Post()
  public create(@Body() createOrderDto: CreateOrderDto): Promise<Message> {
    return this.orderService.create(createOrderDto);
  }

  @Get(":id")
  public findById(@Param("id", ParseUUIDPipe) id: string): Promise<Order> {
    return this.orderService.findById(id);
  }

  @Get("findManyByUser/:user")
  public findManyByUser(
    @Param("user", ParseUUIDPipe) user: string,
  ): Promise<Order[]> {
    return this.orderService.findManyByUser(user);
  }

  @Delete(":id")
  public delete(@Param("id", ParseUUIDPipe) id: string): Promise<Message> {
    return this.orderService.delete(id);
  }
}
