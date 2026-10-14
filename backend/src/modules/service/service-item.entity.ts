import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('service_items')
export class ServiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '项目名称' })
  name: string;

  @Column({ nullable: true, comment: '分类' })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '价格' })
  price: number;

  @Column({ default: 0, comment: '时长(分钟)' })
  duration: number;

  @Column({ nullable: true, comment: '项目图片' })
  image: string;

  @Column({ nullable: true, comment: '项目描述' })
  description: string;

  @Column({ default: 1, comment: '状态: 0下架/1上架' })
  status: number;

  @Column({ default: 0, comment: '排序' })
  sort: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
