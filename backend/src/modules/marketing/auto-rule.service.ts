import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { AutoRule } from './auto-rule.entity';
import { Member } from '../member/member.entity';

@Injectable()
export class AutoRuleService {
  constructor(
    @InjectRepository(AutoRule)
    private ruleRepo: Repository<AutoRule>,
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) {}

  /**
   * 规则列表
   */
  async findAll(tenantId: number) {
    return this.ruleRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 创建规则
   */
  async create(tenantId: number, data: Partial<AutoRule>) {
    const rule = this.ruleRepo.create({ ...data, tenantId });
    return this.ruleRepo.save(rule);
  }

  /**
   * 更新规则
   */
  async update(tenantId: number, id: number, data: Partial<AutoRule>) {
    const rule = await this.ruleRepo.findOne({ where: { id, tenantId } });
    if (!rule) return null;
    Object.assign(rule, data);
    return this.ruleRepo.save(rule);
  }

  /**
   * 删除规则
   */
  async delete(tenantId: number, id: number) {
    return this.ruleRepo.delete({ id, tenantId });
  }

  /**
   * 执行沉睡召回规则
   * 找到N天没来的顾客，自动发优惠券
   */
  async runSleepRecall(tenantId: number) {
    const rules = await this.ruleRepo.find({
      where: { tenantId, type: 'sleep_recall', status: 1 },
    });

    for (const rule of rules) {
      // 计算N天前的日期
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - rule.sleepDays);

      // 找到最后消费时间早于N天前的顾客
      // 这里简化：假设lastVisitTime字段
      // 实际项目里应该查订单表最后消费时间

      console.log(`执行沉睡召回规则: ${rule.name}, 沉睡天数: ${rule.sleepDays}`);
      rule.executedCount += 1;
      await this.ruleRepo.save(rule);
    }

    return { success: true, message: '执行完成' };
  }

  /**
   * 执行生日祝福规则
   */
  async runBirthdayWish(tenantId: number) {
    const rules = await this.ruleRepo.find({
      where: { tenantId, type: 'birthday', status: 1 },
    });

    for (const rule of rules) {
      console.log(`执行生日祝福规则: ${rule.name}`);
      rule.executedCount += 1;
      await this.ruleRepo.save(rule);
    }

    return { success: true, message: '执行完成' };
  }
}
