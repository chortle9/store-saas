import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '优惠券名称' })
  name: string;

  @Column({ comment: '类型: cash代金券/discount折扣券/experience体验券' })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '面值/折扣(折扣为8.5表示85折)' })
  value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '最低消费门槛' })
  minAmount: number;

  @Column({ default: 0, comment: '发放总量, 0为不限' })
  totalCount: number;

  @Column({ default: 0, comment: '已领取数量' })
  receivedCount: number;

  @Column({ type: 'int', default: 30, comment: '有效天数(领取后)' })
  validDays: number;

  @Column({ default: 1, comment: '状态: 0停用/1启用' })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
