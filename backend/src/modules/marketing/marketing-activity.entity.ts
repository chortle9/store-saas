import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('marketing_activities')
export class MarketingActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '活动名称' })
  name: string;

  @Column({ comment: '类型: group_buy拼团/seckill秒杀/referral裂变' })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '活动价格' })
  activityPrice: number;

  @Column({ type: 'int', comment: '关联服务项目ID' })
  serviceId: number;

  @Column({ nullable: true, comment: '项目名称(冗余)' })
  serviceName: string;

  @Column({ type: 'int', default: 2, comment: '拼团人数' })
  groupCount: number;

  @Column({ type: 'datetime', comment: '活动开始时间' })
  startTime: Date;

  @Column({ type: 'datetime', comment: '活动结束时间' })
  endTime: Date;

  @Column({ type: 'int', default: 0, comment: '已参与人数' })
  joinedCount: number;

  @Column({ default: 'active', comment: '状态: active进行中/ended已结束' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
