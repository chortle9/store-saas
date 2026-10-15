import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';
import { Order } from '../order/order.entity';

@Injectable()
export class MemberTierService {
  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  /**
   * 自动给会员分层
   */
  async autoTier(tenantId: number) {
    const members = await this.memberRepo.find({ where: { tenantId } });

    for (const member of members) {
      // 查这个会员的总消费
      const orders = await this.orderRepo.find({
        where: {
          tenantId,
          memberId: member.id,
          status: 'completed',
        },
      });

      const totalAmount = orders.reduce((sum, o) => sum + Number(o.payAmount), 0);
      const visitCount = orders.length;

      // 根据总消费分层
      let levelId = 1; // 普通会员
      if (totalAmount >= 10000) {
        levelId = 4; // 钻石会员
      } else if (totalAmount >= 5000) {
        levelId = 3; // 金卡会员
      } else if (totalAmount >= 1000) {
        levelId = 2; // 银卡会员
      }

      member.levelId = levelId;
      member.totalConsume = totalAmount;
      await this.memberRepo.save(member);
    }

    return { success: true, message: '会员分层完成' };
  }

  /**
   * 分层统计
   */
  async getTierStats(tenantId: number) {
    const members = await this.memberRepo.find({ where: { tenantId } });

    const stats = {
      total: members.length,
      normal: 0,
      silver: 0,
      gold: 0,
      diamond: 0,
    };

    members.forEach(m => {
      if (m.levelId === 4) stats.diamond++;
      else if (m.levelId === 3) stats.gold++;
      else if (m.levelId === 2) stats.silver++;
      else stats.normal++;
    });

    return stats;
  }
}
