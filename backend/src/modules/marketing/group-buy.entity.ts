import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('group_buy_activities')
export class GroupBuyActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '活动标题' })
  title: string;

  @Column({ comment: '关联服务项目ID' })
  serviceId: number;

  @Column({ comment: '服务项目名称' })
  serviceName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '原价' })
  originalPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '拼团价' })
  groupPrice: number;

  @Column({ comment: '成团人数' })
  requiredCount: number;

  @Column({ comment: '活动开始时间' })
  startTime: Date;

  @Column({ comment: '活动结束时间' })
  endTime: Date;

  @Column({ default: 1, comment: '状态: 0下架/1上架' })
  status: number;

  @Column({ default: 0, comment: '已开团数' })
  groupCount: number;

  @Column({ default: 0, comment: '已成团数' })
  successCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
