import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('moments_materials')
export class MomentMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '朋友圈文案' })
  content: string;

  @Column({ type: 'simple-json', nullable: true, comment: '图片列表' })
  images: string[];

  @Column({ comment: '分类: 日常/活动/顾客案例/促销' })
  category: string;

  @Column({ default: 1, comment: '状态: 0下架/1上架' })
  status: number;

  @CreateDateColumn()
  createdAt: Date;
}
