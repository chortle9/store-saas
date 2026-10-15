import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Order } from '../order/order.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  /**
   * 创建支付单
   */
  async createPayment(tenantId: number, data: {
    orderId: number;
    amount: number; // 单位：元
    payMethod: string;
  }) {
    // 检查订单是否存在
    const order = await this.orderRepo.findOne({ where: { id: data.orderId, tenantId } });
    if (!order) throw new NotFoundException('订单不存在');

    // 生成支付单号
    const paymentNo = 'PAY' + Date.now() + Math.floor(Math.random() * 1000);

    // 创建支付记录
    const payment = await this.paymentRepo.save({
      tenantId,
      paymentNo,
      orderId: data.orderId,
      amount: Math.round(data.amount * 100), // 转成分
      payMethod: data.payMethod,
      status: 'pending',
    });

    // 模拟返回支付参数（真实环境这里会调用微信/支付宝API）
    return {
      paymentNo: payment.paymentNo,
      amount: data.amount,
      payMethod: data.payMethod,
      status: 'pending',
      // 模拟支付参数
      payParams: {
        timeStamp: Date.now().toString(),
        nonceStr: Math.random().toString(36).substring(2, 15),
        package: 'prepay_id=mock_prepay_id',
        signType: 'RSA',
        paySign: 'mock_sign',
      },
      message: '模拟支付参数，开发环境用',
    };
  }

  /**
   * 模拟支付成功（开发环境用）
   */
  async mockPaySuccess(tenantId: number, paymentNo: string) {
    const payment = await this.paymentRepo.findOne({ where: { paymentNo, tenantId } });
    if (!payment) throw new NotFoundException('支付单不存在');

    // 更新支付状态
    payment.status = 'paid';
    payment.transactionId = 'MOCK_' + Date.now();
    payment.paidAt = new Date();
    await this.paymentRepo.save(payment);

    // 更新订单状态
    const order = await this.orderRepo.findOne({ where: { id: payment.orderId, tenantId } });
    if (order) {
      order.status = 'completed';
      order.paidAt = new Date();
      await this.orderRepo.save(order);
    }

    return {
      success: true,
      message: '支付成功',
      paymentNo,
      orderId: payment.orderId,
    };
  }

  /**
   * 支付回调（真实环境微信/支付宝调用）
   */
  async handleCallback(data: any) {
    // 真实环境这里会验证签名、解析回调数据
    // 然后更新支付状态和订单状态
    console.log('支付回调:', data);
    return { code: 'SUCCESS', message: '成功' };
  }

  /**
   * 支付记录列表
   */
  async findAll(tenantId: number, query: { page?: number; pageSize?: number; status?: string }) {
    const { page = 1, pageSize = 20, status } = query;
    const where: any = { tenantId };

    if (status) where.status = status;

    const [list, total] = await this.paymentRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { list, total, page, pageSize };
  }

  /**
   * 退款
   */
  async refund(tenantId: number, paymentNo: string, reason: string) {
    const payment = await this.paymentRepo.findOne({ where: { paymentNo, tenantId } });
    if (!payment) throw new NotFoundException('支付单不存在');

    payment.status = 'refunded';
    await this.paymentRepo.save(payment);

    // 更新订单状态
    const order = await this.orderRepo.findOne({ where: { id: payment.orderId, tenantId } });
    if (order) {
      order.status = 'refunded';
      order.remark = reason;
      await this.orderRepo.save(order);
    }

    return { success: true, message: '退款成功' };
  }
}
