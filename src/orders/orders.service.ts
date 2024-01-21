import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

type IOrderQuery = {
  page: number;
  pageSize: number;
  orderId?: number;
  orderName?: string;
  orderDescription?: string;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const order = this.ordersRepository.create(createOrderDto);
    return this.ordersRepository.save(order);
  }

  async findAll(params: IOrderQuery) {
    const { page, pageSize, orderName = '', orderId } = params;
    const where = orderName === '' ? { orderId } : { orderName };
    console.log('where', where);
    const result = await this.ordersRepository.findAndCount({
      take: pageSize,
      skip: pageSize * (page - 1),
      where,
    });
    return { total: result[1], data: result[0], current: page, pageSize };
  }

  async findOne(orderId: number) {
    const order = await this.ordersRepository.findOne({
      where: { orderId: orderId },
    });
    if (!order) {
      throw new NotFoundException(`order #${orderId} not found`);
    }
    return order;
  }

  async update(orderId: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.ordersRepository.preload({
      orderId: orderId,
      ...updateOrderDto,
    });
    if (!order) {
      throw new NotFoundException(`order #${orderId} not found`);
    }
    return this.ordersRepository.save(order);
  }

  async remove(orderId: number) {
    const order = await this.findOne(orderId);
    return this.ordersRepository.remove(order);
  }
}
