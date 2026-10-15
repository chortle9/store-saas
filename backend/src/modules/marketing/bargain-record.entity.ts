import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('bargain_records')
export class BargainRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ comment: '活动ID' })
  activityId: number;

  @Column({ comment: '发起砍价用户ID' })
  userId: number;

  @Column({ comment: '发起砍价用户姓名' })
  userName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '当前价格' })
  currentPrice: number;

  @Column({ default: 0, comment: '已砍次数' })
  bargainTimes: number;

  @Column({ default: 'ongoing', comment: '状态: ongoing进行中/success砍价成功/failed失败' })
  status: string;

  @Column({ comment: '过期时间' })
  expireTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}
