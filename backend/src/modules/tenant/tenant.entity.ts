import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '店铺名称' })
  name: string;

  @Column({ nullable: true, comment: '店铺logo' })
  logo: string;

  @Column({ nullable: true, comment: '联系电话' })
  phone: string;

  @Column({ nullable: true, comment: '店铺地址' })
  address: string;

  @Column({ nullable: true, comment: '营业时间' })
  businessHours: string;

  @Column({ nullable: true, comment: '店铺简介' })
  description: string;

  @Column({ default: 'basic', comment: '套餐: basic/pro/enterprise' })
  plan: string;

  @Column({ type: 'datetime', nullable: true, comment: '套餐到期时间' })
  planExpireAt: Date;

  @Column({ default: 1, comment: '状态: 0禁用/1正常' })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
