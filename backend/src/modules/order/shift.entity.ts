import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('shift_records', { comment: '交班记录表' })
export class ShiftRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '交班人ID' })
  staffId: number;

  @Column({ comment: '交班人姓名' })
  staffName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '现金收入' })
  cashAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '微信收入' })
  wechatAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '支付宝收入' })
  alipayAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '会员余额收入' })
  balanceAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '总金额' })
  totalAmount: number;

  @Column({ comment: '订单数' })
  orderCount: number;

  @Column({ nullable: true, comment: '备注' })
  remark: string;

  @CreateDateColumn()
  createdAt: Date;
}
