import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('members', { comment: '会员表' })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '姓名' })
  name: string;

  @Column({ nullable: true, comment: '手机号' })
  phone: string;

  @Column({ nullable: true, comment: '性别: 男/女/未知' })
  gender: string;

  @Column({ type: 'date', nullable: true, comment: '生日' })
  birthday: Date;

  @Column({ nullable: true, comment: '头像' })
  avatar: string;

  @Column({ nullable: true, comment: '来源渠道: 到店/抖音/小红书/老客推荐' })
  source: string;

  @Column({ type: 'simple-json', nullable: true, comment: '标签列表' })
  tags: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '账户余额' })
  balance: number;

  @Column({ default: 0, comment: '积分' })
  points: number;

  @Column({ default: 1, comment: '会员等级ID' })
  levelId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '累计消费金额' })
  totalConsume: number;

  @Column({ nullable: true, comment: '备注/过敏信息/禁忌' })
  remark: string;

  @Column({ type: 'datetime', nullable: true, comment: '下次回访时间' })
  nextFollowAt: Date;

  @Column({ default: 1, comment: '状态: 0黑名单/1正常' })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
