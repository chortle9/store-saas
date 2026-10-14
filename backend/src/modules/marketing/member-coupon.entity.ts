import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('member_coupons')
export class MemberCoupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '会员ID' })
  memberId: number;

  @Column({ comment: '优惠券ID' })
  couponId: number;

  @Column({ comment: '优惠券名称(冗余)' })
  couponName: string;

  @Column({ default: 'unused', comment: '状态: unused未使用/used已使用/expired已过期' })
  status: string;

  @Column({ type: 'datetime', comment: '领取时间' })
  receivedAt: Date;

  @Column({ type: 'datetime', comment: '过期时间' })
  expireAt: Date;

  @Column({ type: 'datetime', nullable: true, comment: '使用时间' })
  usedAt: Date;

  @Column({ nullable: true, comment: '使用订单ID' })
  orderId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
