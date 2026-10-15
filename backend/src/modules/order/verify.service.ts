import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class VerifyService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  // 核销订单
  async verifyOrder(tenantId: number, verifyCode: string) {
    const order = await this.orderRepo.findOne({
      where: { tenantId, verifyCode },
    });

    if (!order) throw new NotFoundException('核销码不存在');
    if (order.status === 'completed') throw new Error('该订单已核销');

    order.status = 'completed';
    order.verifiedAt = new Date();
    await this.orderRepo.save(order);

    return order;
  }
}
