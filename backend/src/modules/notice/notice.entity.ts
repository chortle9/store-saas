import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('notices')
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '通知类型: appointment预约提醒/follow回访提醒/card_expire卡到期/order订单' })
  type: string;

  @Column({ comment: '接收人类型: staff员工/member会员' })
  receiverType: string;

  @Column({ comment: '接收人ID' })
  receiverId: number;

  @Column({ comment: '通知标题' })
  title: string;

  @Column({ nullable: true, comment: '通知内容' })
  content: string;

  @Column({ default: 0, comment: '是否已读: 0未读/1已读' })
  isRead: number;

  @CreateDateColumn()
  createdAt: Date;
}
