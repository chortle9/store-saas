import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('group_buy_orders')
export class GroupBuyOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '活动ID' })
  activityId: number;

  @Column({ comment: '团长ID' })
  leaderId: number;

  @Column({ comment: '团长姓名' })
  leaderName: string;

  @Column({ comment: '成团人数要求' })
  requiredCount: number;

  @Column({ default: 1, comment: '已参团人数' })
  joinedCount: number;

  @Column({ default: 'pending', comment: '状态: pending待成团/success已成团/failed失败' })
  status: string;

  @Column({ comment: '过期时间' })
  expireTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}
