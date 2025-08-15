import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  public constructor(private readonly orderService: OrderService) {}

  @Post()
  public create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  public findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  public findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findById(id);
  }

  @Patch(':id')
  public update(@Param('id', ParseUUIDPipe) id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  public delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.delete(id);
  }
}
