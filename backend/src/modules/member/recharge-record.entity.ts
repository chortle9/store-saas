import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('recharge_records')
export class RechargeRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '会员ID' })
  memberId: number;

  @Column({ comment: '类型: recharge充值/consume消费/refund退款' })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '变动金额' })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '变动后余额' })
  balance: number;

  @Column({ comment: '支付方式: cash/wechat/alipay' })
  payMethod: string;

  @Column({ nullable: true, comment: '赠送金额（充值赠送）' })
  giftAmount: number;

  @Column({ nullable: true, comment: '备注' })
  remark: string;

  @CreateDateColumn()
  createdAt: Date;
}
