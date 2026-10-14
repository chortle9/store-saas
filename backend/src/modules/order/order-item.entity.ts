import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '订单ID' })
  orderId: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '项目类型: service服务/product商品/card卡项' })
  itemType: string;

  @Column({ comment: '项目ID' })
  itemId: number;

  @Column({ comment: '项目名称' })
  itemName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '单价' })
  price: number;

  @Column({ default: 1, comment: '数量' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '小计' })
  subtotal: number;

  @Column({ nullable: true, comment: '服务技师ID' })
  staffId: number;

  @CreateDateColumn()
  createdAt: Date;
}
