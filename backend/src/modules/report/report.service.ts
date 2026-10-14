import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order } from '../order/order.entity';
import { Member } from '../member/member.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Staff } from '../staff/staff.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,
  ) {}

  // 营收日报
  async revenueDaily(tenantId: number, days: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.orderRepo.find({
      where: {
        tenantId,
        paidAt: Between(startDate, endDate),
        status: 'completed',
      },
      order: { paidAt: 'ASC' },
    });

    // 按天聚合
    const dailyMap = {};
    orders.forEach(o => {
      const day = o.paidAt.toISOString().slice(0, 10);
      if (!dailyMap[day]) dailyMap[day] = { revenue: 0, count: 0 };
      dailyMap[day].revenue += Number(o.payAmount);
      dailyMap[day].count += 1;
    });

    return Object.keys(dailyMap).map(day => ({
      date: day,
      revenue: dailyMap[day].revenue,
      orderCount: dailyMap[day].count,
    }));
  }

  // 技师业绩排行
  async staffPerformance(tenantId: number) {
    const staffs = await this.staffRepo.find({ where: { tenantId } });
    const orders = await this.orderRepo.find({
      where: { tenantId, status: 'completed' },
    });

    return staffs.map(staff => {
      const staffOrders = orders.filter(o => o.staffId === staff.id);
      const revenue = staffOrders.reduce((sum, o) => sum + Number(o.payAmount), 0);
      return {
        staffId: staff.id,
        staffName: staff.name,
        orderCount: staffOrders.length,
        revenue,
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }

  // 会员复购分析
  async memberAnalysis(tenantId: number) {
    const members = await this.memberRepo.find({ where: { tenantId } });
    const orders = await this.orderRepo.find({
      where: { tenantId, status: 'completed' },
    });

    // 按会员统计消费次数
    const orderCountMap = {};
    orders.forEach(o => {
      if (!orderCountMap[o.memberId]) orderCountMap[o.memberId] = 0;
      orderCountMap[o.memberId]++;
    });

    let oneTime = 0;
    let repeat = 0;
    let highValue = 0;

    members.forEach(m => {
      const count = orderCountMap[m.id] || 0;
      if (count === 1) oneTime++;
      if (count >= 2) repeat++;
      if (Number(m.totalConsume) >= 2000) highValue++;
    });

    return {
      totalMembers: members.length,
      oneTimeMembers: oneTime,
      repeatMembers: repeat,
      highValueMembers: highValue,
      repeatRate: members.length > 0 ? (repeat / members.length * 100).toFixed(1) : 0,
    };
  }
}
