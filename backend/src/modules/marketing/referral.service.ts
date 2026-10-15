import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReferralRecord } from './referral.entity';

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(ReferralRecord)
    private referralRepo: Repository<ReferralRecord>,
  ) {}

  /**
   * 转介绍列表
   */
  async findAll(tenantId: number, query: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 20 } = query;
    const [list, total] = await this.referralRepo.findAndCount({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  /**
   * 新顾客绑定推荐人
   */
  async bindReferrer(tenantId: number, referrerId: number, refereeId: number, refereeName: string) {
    const referrer = await this.referralRepo.findOne({ where: { tenantId, refereeId } });
    if (referrer) throw new Error('该用户已经绑定过推荐人了');

    const record = await this.referralRepo.save({
      tenantId,
      referrerId,
      refereeId,
      refereeName,
      status: 'pending',
    });

    return record;
  }

  /**
   * 新顾客首次消费后，给推荐人发奖励
   */
  async completeReferral(tenantId: number, refereeId: number, rewardType: string, rewardAmount: number) {
    const record = await this.referralRepo.findOne({ where: { tenantId, refereeId, status: 'pending' } });
    if (!record) return;

    record.status = 'completed';
    record.rewardType = rewardType;
    record.rewardAmount = rewardAmount;
    await this.referralRepo.save(record);

    // TODO: 给推荐人发奖励（优惠券/积分/余额）
    // 这里后续可以对接会员模块

    return record;
  }

  /**
   * 推荐统计
   */
  async getStats(tenantId: number) {
    const total = await this.referralRepo.count({ where: { tenantId } });
    const completed = await this.referralRepo.count({ where: { tenantId, status: 'completed' } });
    return { total, completed };
  }
}
