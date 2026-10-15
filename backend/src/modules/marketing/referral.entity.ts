import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('referral_records')
export class ReferralRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '推荐人ID（老顾客）' })
  referrerId: number;

  @Column({ comment: '推荐人姓名' })
  referrerName: string;

  @Column({ comment: '被推荐人ID（新顾客）' })
  refereeId: number;

  @Column({ comment: '被推荐人姓名' })
  refereeName: string;

  @Column({ default: 'pending', comment: '状态: pending待生效/completed已完成' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '推荐奖励金额' })
  rewardAmount: number;

  @Column({ nullable: true, comment: '推荐奖励类型: coupon券/points积分/balance余额' })
  rewardType: string;

  @CreateDateColumn()
  createdAt: Date;
}
