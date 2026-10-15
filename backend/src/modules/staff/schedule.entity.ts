import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('staff_schedules')
export class StaffSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '员工ID' })
  staffId: number;

  @Column({ comment: '员工姓名' })
  staffName: string;

  @Column({ comment: '排班日期' })
  workDate: Date;

  @Column({ comment: '上班时间' })
  startTime: string;

  @Column({ comment: '下班时间' })
  endTime: string;

  @Column({ default: 'working', comment: '状态: working上班/off休息/leave请假' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
