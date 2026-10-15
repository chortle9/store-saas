import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '支付单号' })
  paymentNo: string;

  @Column({ comment: '关联订单ID' })
  orderId: number;

  @Column({ comment: '支付金额（分）' })
  amount: number;

  @Column({ comment: '支付方式: wechat/alipay/cash/balance' })
  payMethod: string;

  @Column({ default: 'pending', comment: '状态: pending/paid/failed/refunded' })
  status: string;

  @Column({ nullable: true, comment: '第三方交易号' })
  transactionId: string;

  @Column({ nullable: true, comment: '支付时间' })
  paidAt: Date;

  @Column({ nullable: true, comment: '回调内容' })
  callbackData: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
