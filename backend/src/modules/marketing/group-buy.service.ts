import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { GroupBuyActivity } from './group-buy.entity';
import { GroupBuyOrder } from './group-buy-order.entity';
import { ServiceItem } from '../service/service-item.entity';

@Injectable()
export class GroupBuyService {
  constructor(
    @InjectRepository(GroupBuyActivity)
    private activityRepo: Repository<GroupBuyActivity>,
    @InjectRepository(GroupBuyOrder)
    private orderRepo: Repository<GroupBuyOrder>,
    @InjectRepository(ServiceItem)
    private serviceRepo: Repository<ServiceItem>,
  ) {}

  /**
   * 活动列表
   */
  async findAll(tenantId: number, query: { page?: number; pageSize?: number; status?: number }) {
    const { page = 1, pageSize = 20, status } = query;
    const where: any = { tenantId };
    if (status !== undefined) where.status = status;

    const [list, total] = await this.activityRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { list, total, page, pageSize };
  }

  /**
   * 创建活动
   */
  async create(tenantId: number, data: Partial<GroupBuyActivity>) {
    // 根据serviceId自动查询服务名称和原价
    if (data.serviceId) {
      const service = await this.serviceRepo.findOne({ where: { id: data.serviceId, tenantId } });
      if (service) {
        data.serviceName = service.name;
        data.originalPrice = service.price;
      }
    }
    const activity = this.activityRepo.create({ ...data, tenantId });
    return this.activityRepo.save(activity);
  }

  /**
   * 更新活动
   */
  async update(tenantId: number, id: number, data: Partial<GroupBuyActivity>) {
    const activity = await this.activityRepo.findOne({ where: { id, tenantId } });
    if (!activity) throw new NotFoundException('活动不存在');
    Object.assign(activity, data);
    return this.activityRepo.save(activity);
  }

  /**
   * 删除活动
   */
  async delete(tenantId: number, id: number) {
    return this.activityRepo.delete({ id, tenantId });
  }

  /**
   * 公开接口：获取进行中的活动列表（小程序用）
   */
  async getPublicActivities(tenantId: number) {
    const now = new Date();
    return this.activityRepo.find({
      where: {
        tenantId,
        status: 1,
        startTime: Between(new Date(0), now),
        endTime: Between(now, new Date('2099-12-31')),
      },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 开团
   */
  async createGroup(tenantId: number, activityId: number, memberId: number, memberName: string) {
    const activity = await this.activityRepo.findOne({ where: { id: activityId, tenantId } });
    if (!activity) throw new NotFoundException('活动不存在');

    // 24小时后过期
    const expireTime = new Date();
    expireTime.setHours(expireTime.getHours() + 24);

    const order = await this.orderRepo.save({
      tenantId,
      activityId,
      leaderId: memberId,
      leaderName: memberName,
      requiredCount: activity.requiredCount,
      joinedCount: 1,
      status: 'pending',
      expireTime,
    });

    activity.groupCount += 1;
    await this.activityRepo.save(activity);

    return order;
  }

  /**
   * 参团
   */
  async joinGroup(tenantId: number, groupOrderId: number, memberId: number, memberName: string) {
    const groupOrder = await this.orderRepo.findOne({ where: { id: groupOrderId, tenantId } });
    if (!groupOrder) throw new NotFoundException('拼团不存在');
    if (groupOrder.status !== 'pending') throw new Error('拼团已结束');

    groupOrder.joinedCount += 1;
    if (groupOrder.joinedCount >= groupOrder.requiredCount) {
      groupOrder.status = 'success';
      // 更新活动已成团数
      const activity = await this.activityRepo.findOne({ where: { id: groupOrder.activityId, tenantId } });
      if (activity) {
        activity.successCount += 1;
        await this.activityRepo.save(activity);
      }
    }

    return this.orderRepo.save(groupOrder);
  }
}
