import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tenant_websites')
export class TenantWebsite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属租户ID' })
  tenantId: number;

  @Column({ nullable: true, comment: '网站标题' })
  title: string;

  @Column({ nullable: true, comment: '副标题/slogan' })
  subtitle: string;

  @Column({ type: 'text', nullable: true, comment: '关于我们内容' })
  aboutUs: string;

  @Column({ type: 'text', nullable: true, comment: '关于我们小标题' })
  aboutTitle: string;

  @Column({ type: 'simple-json', nullable: true, comment: '轮播图数组 [{image, title, subtitle}]' })
  banners: string;

  @Column({ nullable: true, comment: '店铺地址' })
  address: string;

  @Column({ nullable: true, comment: '联系电话' })
  phone: string;

  @Column({ nullable: true, comment: '营业时间' })
  businessHours: string;

  @Column({ type: 'simple-json', nullable: true, comment: '环境展示图片数组' })
  environmentImages: string;

  @Column({ type: 'simple-json', nullable: true, comment: '客户评价 [{name, content, avatar}]' })
  testimonials: string;

  @Column({ default: '#1a1a2e', comment: '主色调' })
  primaryColor: string;

  @Column({ default: '#c9a96e', comment: '辅助色/金色点缀' })
  accentColor: string;

  @Column({ default: 1, comment: '是否开启在线预约' })
  enableBooking: number;

  @Column({ nullable: true, comment: '微信二维码图片' })
  wechatQr: string;

  @Column({ nullable: true, comment: '版权信息' })
  copyright: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
