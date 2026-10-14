import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('operation_logs')
export class OperationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '操作人ID' })
  operatorId: number;

  @Column({ comment: '操作人姓名' })
  operatorName: string;

  @Column({ comment: '模块' })
  module: string;

  @Column({ comment: '操作类型: create/update/delete/login' })
  action: string;

  @Column({ type: 'text', nullable: true, comment: '操作内容' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
