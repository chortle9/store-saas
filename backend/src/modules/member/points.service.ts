import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointsRecord } from './points-record.entity';
import { Member } from './member.entity';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(PointsRecord)
    private pointsRepo: Repository<PointsRecord>,
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) {}

  async getRecords(tenantId: number, memberId: number) {
    return this.pointsRepo.find({
      where: { tenantId, memberId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async addPoints(tenantId: number, memberId: number, points: number, source: string, remark?: string) {
    const member = await this.memberRepo.findOne({ where: { id: memberId, tenantId } });
    if (!member) throw new Error('会员不存在');

    const newBalance = member.points + points;
    await this.memberRepo.update({ id: memberId }, { points: newBalance });

    const record = this.pointsRepo.create({
      tenantId,
      memberId,
      type: points > 0 ? 'earn' : 'spend',
      points: Math.abs(points),
      balance: newBalance,
      source,
      remark,
    });
    return this.pointsRepo.save(record);
  }
}
