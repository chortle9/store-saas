import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('purchase_records', { comment: '采购入库记录表' })
export class PurchaseRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '商品ID' })
  productId: number;

  @Column({ comment: '商品名称' })
  productName: string;

  @Column({ comment: '入库数量' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '采购单价' })
  costPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '总金额' })
  totalAmount: number;

  @Column({ nullable: true, comment: '供应商' })
  supplier: string;

  @CreateDateColumn()
  createdAt: Date;
}
