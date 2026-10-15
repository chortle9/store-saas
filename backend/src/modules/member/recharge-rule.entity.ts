import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('recharge_rules', { comment: '储值优惠规则表' })
export class RechargeRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '充值金额' })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '赠送金额' })
  giftAmount: number;

  @Column({ default: 1, comment: '状态: 0关闭/1开启' })
  status: number;

  @CreateDateColumn()
  createdAt: Date;
}
