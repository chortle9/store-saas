import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '订单号' })
  orderNo: string;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '会员ID' })
  memberId: number;

  @Column({ comment: '会员姓名(冗余)' })
  memberName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '订单总金额' })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '优惠金额' })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '实付金额' })
  payAmount: number;

  @Column({ comment: '支付方式: cash/wechat/alipay/balance/card' })
  payMethod: string;

  @Column({ default: 'pending', comment: '状态: pending待支付/completed已完成/refunded已退款' })
  status: string;

  @Column({ nullable: true, comment: '操作员工ID' })
  staffId: number;

  @Column({ nullable: true, comment: '备注' })
  remark: string;

  @Column({ type: 'datetime', nullable: true, comment: '支付时间' })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
