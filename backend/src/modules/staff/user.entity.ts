import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ unique: true, comment: '登录账号' })
  username: string;

  @Column({ comment: '密码哈希' })
  password: string;

  @Column({ comment: '姓名' })
  realName: string;

  @Column({ nullable: true, comment: '手机号' })
  phone: string;

  @Column({ default: 'admin', comment: '角色: super_admin/店主/店长/店员/财务' })
  role: string;

  @Column({ default: 1, comment: '状态: 0禁用/1正常' })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
