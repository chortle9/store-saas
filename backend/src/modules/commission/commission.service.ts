import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CommissionRecord } from './commission.entity';
import { ServiceItem } from '../service/service-item.entity';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(CommissionRecord)
    private commissionRepo: Repository<CommissionRecord>,
    @InjectRepository(ServiceItem)
    private serviceRepo: Repository<ServiceItem>,
  ) {}

  /**
   * 自动计算并生成提成记录
   */
  async generateCommission(
    tenantId: number,
    orderId: number,
    orderNo: string,
    items: Array<{ itemId: number; itemName: string; price: number; quantity: number; staffId?: number; staffName?: string }>
  ) {
    for (const item of items) {
      if (!item.staffId) continue;

      // 查询项目的提成设置
      const service = await this.serviceRepo.findOne({ where: { id: item.itemId, tenantId } });
      if (!service) continue;

      const amount = item.price * item.quantity;
      let commissionAmount = 0;

      if (service.fixedCommission && service.fixedCommission > 0) {
        commissionAmount = service.fixedCommission * item.quantity;
      } else if (service.commissionRate > 0) {
        commissionAmount = amount * service.commissionRate / 100;
      }

      if (commissionAmount > 0) {
        await this.commissionRepo.save({
          tenantId,
          staffId: item.staffId,
          staffName: item.staffName || '未知',
          orderId,
          orderNo,
          itemName: item.itemName,
          amount,
          commissionRate: service.commissionRate,
          commissionAmount,
          status: 'pending',
        });
      }
    }
  }

  /**
   * 提成列表
   */
  async findAll(tenantId: number, query: { page?: number; pageSize?: number; staffId?: number; startDate?: string; endDate?: string; status?: string }) {
    const { page = 1, pageSize = 20, staffId, startDate, endDate, status } = query;
    const where: any = { tenantId };

    if (staffId) where.staffId = staffId;
    if (status) where.status = status;
    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    const [list, total] = await this.commissionRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { list, total, page, pageSize };
  }

  /**
   * 技师提成汇总（按员工分组）
   */
  async getStaffSummary(tenantId: number, query: { startDate?: string; endDate?: string }) {
    const { startDate, endDate } = query;
    const where: any = { tenantId, status: 'pending' };

    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    const records = await this.commissionRepo.find({ where });

    // 按员工分组汇总
    const summaryMap: Record<number, any> = {};
    records.forEach(r => {
      if (!summaryMap[r.staffId]) {
        summaryMap[r.staffId] = {
          staffId: r.staffId,
          staffName: r.staffName,
          orderCount: 0,
          totalAmount: 0,
          totalCommission: 0,
        };
      }
      summaryMap[r.staffId].orderCount += 1;
      summaryMap[r.staffId].totalAmount += Number(r.amount);
      summaryMap[r.staffId].totalCommission += Number(r.commissionAmount);
    });

    return Object.values(summaryMap);
  }

  /**
   * 结算提成
   */
  async settle(tenantId: number, staffId: number, startDate: string, endDate: string) {
    await this.commissionRepo.update(
      { tenantId, staffId, status: 'pending', createdAt: Between(new Date(startDate), new Date(endDate)) },
      { status: 'paid' }
    );
    return { success: true, message: '结算成功' };
  }
}
