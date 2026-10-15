import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CommissionService } from '../commission/commission.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,
    private commissionService: CommissionService,
  ) {}

  /**
   * 订单列表
   */
  async findAll(tenantId: number, query: { page?: number; pageSize?: number; status?: string; startDate?: string; endDate?: string }) {
    const { page = 1, pageSize = 20, status, startDate, endDate } = query;
    const where: any = { tenantId };

    if (status) where.status = status;
    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    const [list, total] = await this.orderRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { list, total, page, pageSize };
  }

  /**
   * 订单详情（含明细）
   */
  async findOne(tenantId: number, id: number) {
    const order = await this.orderRepo.findOne({ where: { id, tenantId } });
    if (!order) throw new NotFoundException('订单不存在');

    const items = await this.itemRepo.find({ where: { orderId: id, tenantId } });
    return { ...order, items };
  }

  /**
   * 创建订单（开单收银）
   */
  async create(tenantId: number, data: {
    memberId: number;
    memberName: string;
    items: Array<{ itemType: string; itemId: number; itemName: string; price: number; quantity: number; staffId?: number }>;
    payMethod: string;
    discountAmount?: number;
    staffId?: number;
    remark?: string;
  }) {
    const { items, discountAmount = 0, ...orderData } = data;

    // 计算总金额
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const payAmount = totalAmount - discountAmount;

    // 生成订单号
    const orderNo = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);

    const order = await this.orderRepo.save({
      tenantId,
      orderNo,
      totalAmount,
      discountAmount,
      payAmount,
      status: 'completed', // MVP默认已完成
      paidAt: new Date(),
      ...orderData,
    });

    // 保存订单明细
    for (const item of items) {
      await this.itemRepo.save({
        orderId: order.id,
        tenantId,
        subtotal: item.price * item.quantity,
        ...item,
      });
    }

    // 自动生成员工提成记录
    await this.commissionService.generateCommission(tenantId, order.id, order.orderNo, items);

    return this.findOne(tenantId, order.id);
  }

  /**
   * 退款
   */
  async refund(tenantId: number, id: number, reason: string) {
    const order = await this.findOne(tenantId, id);
    order.status = 'refunded';
    order.remark = reason;
    return this.orderRepo.save(order);
  }

  /**
   * 今日营收统计
   */
  async getTodayRevenue(tenantId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.payAmount)', 'total')
      .where('order.tenantId = :tenantId', { tenantId })
      .andWhere('order.status = :status', { status: 'completed' })
      .andWhere('order.paidAt BETWEEN :start AND :end', { start: today, end: tomorrow })
      .getRawOne();

    return { todayRevenue: parseFloat(result.total || 0) };
  }
}
