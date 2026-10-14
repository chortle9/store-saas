import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('stock_products')
export class StockProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '产品名称' })
  name: string;

  @Column({ comment: '分类' })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '成本价' })
  costPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '售价' })
  salePrice: number;

  @Column({ type: 'int', default: 0, comment: '库存数量' })
  stock: number;

  @Column({ type: 'int', default: 10, comment: '预警库存' })
  warnStock: number;

  @Column({ nullable: true, comment: '单位' })
  unit: string;

  @Column({ default: 1, comment: '状态: 0下架/1上架' })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
