import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('member_levels')
export class MemberLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '等级名称' })
  name: string;

  @Column({ comment: '等级: 1普通/2银卡/3金卡/4钻石' })
  level: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '升级所需累计消费' })
  needAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, comment: '折扣率%' })
  discountRate: number;

  @Column({ type: 'int', default: 0, comment: '积分倍率' })
  pointsRate: number;

  @Column({ nullable: true, comment: '等级权益说明' })
  benefits: string;

  @Column({ default: 1, comment: '状态' })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
