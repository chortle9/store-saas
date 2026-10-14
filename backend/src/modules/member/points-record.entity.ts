import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('points_records')
export class PointsRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '会员ID' })
  memberId: number;

  @Column({ comment: '类型: earn获取/spend消耗' })
  type: string;

  @Column({ comment: '积分数量（正数）' })
  points: number;

  @Column({ comment: '变动后余额' })
  balance: number;

  @Column({ comment: '来源: order消费/sign签到/admin手动/coupon活动' })
  source: string;

  @Column({ nullable: true, comment: '关联订单ID' })
  orderId: number;

  @Column({ nullable: true, comment: '备注' })
  remark: string;

  @CreateDateColumn()
  createdAt: Date;
}
