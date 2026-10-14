import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ nullable: true, comment: '会员ID' })
  memberId: number;

  @Column({ comment: '会员姓名' })
  memberName: string;

  @Column({ nullable: true, comment: '会员电话' })
  memberPhone: string;

  @Column({ comment: '服务项目ID' })
  serviceId: number;

  @Column({ comment: '服务项目名称(冗余)' })
  serviceName: string;

  @Column({ nullable: true, comment: '技师ID' })
  staffId: number;

  @Column({ nullable: true, comment: '技师姓名(冗余)' })
  staffName: string;

  @Column({ type: 'datetime', comment: '预约时间' })
  appointmentTime: Date;

  @Column({ comment: '时长(分钟)' })
  duration: number;

  @Column({ default: 'pending', comment: '状态: pending确认/confirmed已确认/ongoing进行中/completed完成/cancelled取消/no_show缺席' })
  status: string;

  @Column({ nullable: true, comment: '备注' })
  remark: string;

  @Column({ nullable: true, comment: '取消原因' })
  cancelReason: string;

  @Column({ default: 0, comment: '是否已通知: 0否/1是' })
  notified: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
