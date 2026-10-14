import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '姓名' })
  name: string;

  @Column({ nullable: true, comment: '头像' })
  avatar: string;

  @Column({ nullable: true, comment: '手机号' })
  phone: string;

  @Column({ nullable: true, comment: '岗位: 技师/前台/顾问' })
  position: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, comment: '提成比例%' })
  commissionRate: number;

  @Column({ type: 'simple-json', nullable: true, comment: '可服务项目ID列表' })
  serviceIds: number[];

  @Column({ type: 'simple-json', nullable: true, comment: '排班: [{day:"周一",time:"09:00-18:00"}]' })
  schedule: any[];

  @Column({ default: 1, comment: '状态: 0离职/1在职' })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
