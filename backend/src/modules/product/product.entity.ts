import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products', { comment: '商品表（实物产品）' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '商品名称' })
  name: string;

  @Column({ nullable: true, comment: '商品分类' })
  category: string;

  @Column({ nullable: true, comment: '商品条码' })
  barcode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '售价' })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '成本价' })
  costPrice: number;

  @Column({ nullable: true, comment: '商品图片' })
  image: string;

  @Column({ default: 0, comment: '库存数量' })
  stock: number;

  @Column({ default: 1, comment: '状态: 0下架/1上架' })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
