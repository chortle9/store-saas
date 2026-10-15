import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order } from '../order/order.entity';
import { OrderItem } from '../order/order-item.entity';
import { Member } from '../member/member.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Staff } from '../staff/staff.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
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

  // 项目销售排行
  async itemSalesRanking(tenantId: number) {
    const items = await this.orderItemRepo.find({
      where: { tenantId },
    });

    const itemMap = {};
    items.forEach(item => {
      if (!itemMap[item.itemName]) {
        itemMap[item.itemName] = { itemName: item.itemName, count: 0, amount: 0 };
      }
      itemMap[item.itemName].count += item.quantity;
      itemMap[item.itemName].amount += Number(item.subtotal);
    });

    return Object.values(itemMap)
      .sort((a: any, b: any) => b.amount - a.amount)
      .slice(0, 10);
  }

  // 新老客对比
  async newOldCustomer(tenantId: number, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const members = await this.memberRepo.find({ where: { tenantId } });
    const orders = await this.orderRepo.find({
      where: {
        tenantId,
        paidAt: Between(startDate, new Date()),
        status: 'completed',
      },
    });

    // 统计有多少新顾客（这个月第一次消费）
    let newCustomers = 0;
    let oldCustomers = 0;
    const customerSet = new Set();

    orders.forEach(order => {
      if (!customerSet.has(order.memberId)) {
        customerSet.add(order.memberId);
        // 判断是不是新顾客（注册时间在这个月内）
        const member = members.find(m => m.id === order.memberId);
        if (member && member.createdAt >= startDate) {
          newCustomers++;
        } else {
          oldCustomers++;
        }
      }
    });

    return {
      newCustomers,
      oldCustomers,
      newRate: (newCustomers + oldCustomers) > 0 ? (newCustomers / (newCustomers + oldCustomers) * 100).toFixed(1) : 0,
    };
  }

  // 经营概览（首页用）
  async businessOverview(tenantId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const todayOrders = await this.orderRepo.find({
      where: {
        tenantId,
        paidAt: Between(today, tomorrow),
        status: 'completed',
      },
    });

    const monthOrders = await this.orderRepo.find({
      where: {
        tenantId,
        paidAt: Between(thisMonth, new Date()),
        status: 'completed',
      },
    });

    const memberCount = await this.memberRepo.count({ where: { tenantId } });
    const appointmentCount = await this.appointmentRepo.count({
      where: { tenantId, appointmentTime: Between(today, tomorrow) },
    });

    const todayRevenue = todayOrders.reduce((sum, o) => sum + Number(o.payAmount), 0);
    const monthRevenue = monthOrders.reduce((sum, o) => sum + Number(o.payAmount), 0);

    return {
      todayRevenue,
      todayOrderCount: todayOrders.length,
      todayAppointmentCount: appointmentCount,
      monthRevenue,
      monthOrderCount: monthOrders.length,
      totalMembers: memberCount,
      avgOrderValue: monthOrders.length > 0 ? (monthRevenue / monthOrders.length).toFixed(1) : 0,
    };
  }
}
