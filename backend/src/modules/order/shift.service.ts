import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ShiftRecord } from './shift.entity';
import { Order } from './order.entity';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(ShiftRecord)
    private shiftRepo: Repository<ShiftRecord>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  // 获取当前班次统计
  async getCurrentShiftStats(tenantId: number, staffId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 查今天这个收银员的所有已支付订单
    const orders = await this.orderRepo.find({
      where: {
        tenantId,
        status: 'completed',
        paidAt: Between(today, new Date()),
      },
    });

    let cashAmount = 0;
    let wechatAmount = 0;
    let alipayAmount = 0;
    let balanceAmount = 0;

    orders.forEach(order => {
      switch (order.payMethod) {
        case 'cash':
          cashAmount += Number(order.payAmount);
          break;
        case 'wechat':
          wechatAmount += Number(order.payAmount);
          break;
        case 'alipay':
          alipayAmount += Number(order.payAmount);
          break;
        case 'balance':
          balanceAmount += Number(order.payAmount);
          break;
      }
    });

    return {
      cashAmount,
      wechatAmount,
      alipayAmount,
      balanceAmount,
      totalAmount: cashAmount + wechatAmount + alipayAmount + balanceAmount,
      orderCount: orders.length,
    };
  }

  // 交班
  async doShift(tenantId: number, staffId: number, staffName: string, remark: string) {
    const stats = await this.getCurrentShiftStats(tenantId, staffId);

    const record = await this.shiftRepo.save({
      tenantId,
      staffId,
      staffName,
      ...stats,
      remark,
    });

    return record;
  }

  // 交班记录列表
  async getShiftHistory(tenantId: number) {
    return this.shiftRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
