import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('commission_records')
export class CommissionRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '员工ID' })
  staffId: number;

  @Column({ comment: '员工姓名' })
  staffName: string;

  @Column({ comment: '关联订单ID' })
  orderId: number;

  @Column({ comment: '订单号' })
  orderNo: string;

  @Column({ comment: '项目名称' })
  itemName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '项目金额' })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: '提成比例(%)' })
  commissionRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '提成金额' })
  commissionAmount: number;

  @Column({ default: 'pending', comment: '状态: pending待结算/paid已结算' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
