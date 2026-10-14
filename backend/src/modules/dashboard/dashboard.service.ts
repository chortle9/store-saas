import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Member } from '../member/member.entity';
import { Order } from '../order/order.entity';
import { Appointment } from '../appointment/appointment.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  /**
   * 首页仪表盘数据
   */
  async getSummary(tenantId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // 今日预约
    const todayAppointments = await this.appointmentRepo.count({
      where: {
        tenantId,
        appointmentTime: Between(today, tomorrow),
      },
    });

    // 今日营收
    const todayRevenueResult = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.payAmount)', 'total')
      .where('order.tenantId = :tenantId', { tenantId })
      .andWhere('order.status = :status', { status: 'completed' })
      .andWhere('order.paidAt BETWEEN :start AND :end', { start: today, end: tomorrow })
      .getRawOne();

    // 新增客户（今日）
    const todayNewMembers = await this.memberRepo.count({
      where: {
        tenantId,
        createdAt: Between(today, tomorrow),
      },
    });

    // 总客户数
    const totalMembers = await this.memberRepo.count({ where: { tenantId } });

    // 近7天营收趋势
    const revenueTrend = await this.getRevenueTrend(tenantId, 7);

    return {
      todayAppointments,
      todayRevenue: parseFloat(todayRevenueResult.total || 0),
      todayNewMembers,
      totalMembers,
      revenueTrend,
    };
  }

  /**
   * 近N天营收趋势
   */
  async getRevenueTrend(tenantId: number, days: number) {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const res = await this.orderRepo
        .createQueryBuilder('order')
        .select('SUM(order.payAmount)', 'total')
        .where('order.tenantId = :tenantId', { tenantId })
        .andWhere('order.status = :status', { status: 'completed' })
        .andWhere('order.paidAt BETWEEN :start AND :end', { start: date, end: nextDate })
        .getRawOne();

      result.push({
        date: date.toISOString().slice(5, 10),
        revenue: parseFloat(res.total || 0),
      });
    }
    return result;
  }
}
