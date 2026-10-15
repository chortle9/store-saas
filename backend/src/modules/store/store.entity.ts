import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('stores', { comment: '门店表' })
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '门店名称' })
  name: string;

  @Column({ nullable: true, comment: '门店地址' })
  address: string;

  @Column({ nullable: true, comment: '联系电话' })
  phone: string;

  @Column({ nullable: true, comment: '营业时间' })
  businessHours: string;

  @Column({ default: 1, comment: '状态: 0关闭/1营业' })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
