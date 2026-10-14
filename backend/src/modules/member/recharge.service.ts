import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RechargeRecord } from './recharge-record.entity';
import { Member } from './member.entity';

@Injectable()
export class RechargeService {
  constructor(
    @InjectRepository(RechargeRecord)
    private rechargeRepo: Repository<RechargeRecord>,
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) {}

  async getRecords(tenantId: number, memberId: number) {
    return this.rechargeRepo.find({
      where: { tenantId, memberId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async recharge(tenantId: number, memberId: number, amount: number, giftAmount: number, payMethod: string) {
    const member = await this.memberRepo.findOne({ where: { id: memberId, tenantId } });
    if (!member) throw new Error('会员不存在');

    const totalAdd = amount + giftAmount;
    const newBalance = Number(member.balance) + totalAdd;
    await this.memberRepo.update({ id: memberId }, { balance: newBalance });

    const record = this.rechargeRepo.create({
      tenantId,
      memberId,
      type: 'recharge',
      amount,
      giftAmount,
      balance: newBalance,
      payMethod,
      remark: `充值¥${amount}，赠送¥${giftAmount}`,
    });
    return this.rechargeRepo.save(record);
  }
}
