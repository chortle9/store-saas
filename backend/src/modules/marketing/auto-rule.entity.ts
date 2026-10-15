import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('auto_rules')
export class AutoRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '规则名称' })
  name: string;

  @Column({ comment: '规则类型: sleep_recall沉睡召回/birthday生日/after_consume消费后' })
  type: string;

  @Column({ default: 30, comment: '沉睡天数（仅沉睡召回用）' })
  sleepDays: number;

  @Column({ comment: '奖励类型: coupon优惠券/points积分/balance余额' })
  rewardType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '奖励金额/积分数量' })
  rewardValue: number;

  @Column({ comment: '奖励名称（优惠券名等）' })
  rewardName: string;

  @Column({ default: 1, comment: '状态: 0关闭/1开启' })
  status: number;

  @Column({ default: 0, comment: '已执行次数' })
  executedCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
