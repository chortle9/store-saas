import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { BargainActivity } from './bargain.entity';
import { BargainRecord } from './bargain-record.entity';
import { ServiceItem } from '../service/service-item.entity';

@Injectable()
export class BargainService {
  constructor(
    @InjectRepository(BargainActivity)
    private activityRepo: Repository<BargainActivity>,
    @InjectRepository(BargainRecord)
    private recordRepo: Repository<BargainRecord>,
    @InjectRepository(ServiceItem)
    private serviceRepo: Repository<ServiceItem>,
  ) {}

  /**
   * 活动列表
   */
  async findAll(tenantId: number, query: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 20 } = query;
    const [list, total] = await this.activityRepo.findAndCount({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  /**
   * 创建活动
   */
  async create(tenantId: number, data: Partial<BargainActivity>) {
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
  async update(tenantId: number, id: number, data: Partial<BargainActivity>) {
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
   * 公开接口：获取进行中的活动
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
    });
  }

  /**
   * 发起砍价
   */
  async startBargain(tenantId: number, activityId: number, userId: number, userName: string) {
    const activity = await this.activityRepo.findOne({ where: { id: activityId, tenantId } });
    if (!activity) throw new NotFoundException('活动不存在');

    const expireTime = new Date();
    expireTime.setHours(expireTime.getHours() + 24);

    const record = await this.recordRepo.save({
      tenantId,
      activityId,
      userId,
      userName,
      currentPrice: activity.originalPrice,
      bargainTimes: 0,
      status: 'ongoing',
      expireTime,
    });

    return record;
  }

  /**
   * 帮忙砍价
   */
  async helpBargain(tenantId: number, recordId: number) {
    const record = await this.recordRepo.findOne({ where: { id: recordId, tenantId } });
    if (!record) throw new NotFoundException('砍价记录不存在');
    if (record.status !== 'ongoing') throw new Error('砍价已结束');

    const activity = await this.activityRepo.findOne({ where: { id: record.activityId, tenantId } });
    if (!activity) throw new NotFoundException('活动不存在');

    // 随机砍价 1-10元
    const cutPrice = Math.random() * 9 + 1;
    record.currentPrice = Math.max(activity.minPrice, record.currentPrice - cutPrice);
    record.bargainTimes += 1;

    if (record.currentPrice <= activity.minPrice) {
      record.status = 'success';
    }

    return this.recordRepo.save(record);
  }
}
