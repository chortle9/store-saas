import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity';
import { CardRecord } from './card-record.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepo: Repository<Card>,
    @InjectRepository(CardRecord)
    private recordRepo: Repository<CardRecord>,
  ) {}

  // ========== 卡项模板 ==========
  async findAll(tenantId: number) {
    return this.cardRepo.find({ where: { tenantId, status: 1 } });
  }

  async findOne(tenantId: number, id: number) {
    const card = await this.cardRepo.findOne({ where: { id, tenantId } });
    if (!card) throw new NotFoundException('卡项不存在');
    return card;
  }

  async create(tenantId: number, data: Partial<Card>) {
    const card = this.cardRepo.create({ ...data, tenantId });
    return this.cardRepo.save(card);
  }

  async update(tenantId: number, id: number, data: Partial<Card>) {
    const card = await this.findOne(tenantId, id);
    Object.assign(card, data);
    return this.cardRepo.save(card);
  }

  // ========== 会员持卡记录 ==========
  async getMemberCards(tenantId: number, memberId: number) {
    return this.recordRepo.find({
      where: { tenantId, memberId, status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 给会员开卡
   */
  async issueCard(tenantId: number, memberId: number, cardId: number) {
    const card = await this.findOne(tenantId, cardId);
    const now = new Date();
    const expireDate = new Date(now);
    expireDate.setDate(expireDate.getDate() + card.validDays);

    const record = this.recordRepo.create({
      tenantId,
      memberId,
      cardId: card.id,
      cardName: card.name,
      remainTimes: card.totalTimes,
      remainValue: card.storedValue,
      startAt: now,
      expireAt: expireDate,
      status: 'active',
    });

    return this.recordRepo.save(record);
  }
}
