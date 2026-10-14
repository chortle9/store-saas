import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('card_records')
export class CardRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '会员ID' })
  memberId: number;

  @Column({ comment: '卡ID' })
  cardId: number;

  @Column({ comment: '卡名称(冗余)' })
  cardName: string;

  @Column({ default: 0, comment: '剩余次数(次卡用)' })
  remainTimes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '剩余金额(储值卡用)' })
  remainValue: number;

  @Column({ type: 'datetime', comment: '生效时间' })
  startAt: Date;

  @Column({ type: 'datetime', comment: '到期时间' })
  expireAt: Date;

  @Column({ default: 'active', comment: '状态: active有效/used已用完/expired已过期/refunded已退款' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
