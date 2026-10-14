import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '卡名称' })
  name: string;

  @Column({ comment: '卡类型: times次卡/stored_value储值卡/package套餐卡' })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '售价' })
  price: number;

  @Column({ type: 'int', default: 0, comment: '总次数(次卡用)' })
  totalTimes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '储值金额(储值卡用)' })
  storedValue: number;

  @Column({ type: 'simple-json', nullable: true, comment: '包含服务项目ID列表' })
  serviceIds: number[];

  @Column({ type: 'int', default: 365, comment: '有效期(天)' })
  validDays: number;

  @Column({ nullable: true, comment: '卡描述' })
  description: string;

  @Column({ default: 1, comment: '状态: 0下架/1上架' })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
