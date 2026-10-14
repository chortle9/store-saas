import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

// 实体
import { Tenant } from './modules/tenant/tenant.entity';
import { User } from './modules/staff/user.entity';
import { Member } from './modules/member/member.entity';
import { Appointment } from './modules/appointment/appointment.entity';
import { ServiceItem } from './modules/service/service-item.entity';
import { Staff } from './modules/staff/staff.entity';
import { Card } from './modules/card/card.entity';
import { CardRecord } from './modules/card/card-record.entity';
import { Order } from './modules/order/order.entity';
import { OrderItem } from './modules/order/order-item.entity';
import { Coupon } from './modules/marketing/coupon.entity';
import { MemberCoupon } from './modules/marketing/member-coupon.entity';
import { Notice } from './modules/notice/notice.entity';
import { MemberLevel } from './modules/member/member-level.entity';
import { PointsRecord } from './modules/member/points-record.entity';
import { RechargeRecord } from './modules/member/recharge-record.entity';
import { StockProduct } from './modules/stock/stock-product.entity';
import { MarketingActivity } from './modules/marketing/marketing-activity.entity';
import { TenantWebsite } from './modules/website/website.entity';
import { OperationLog } from './modules/log/operation-log.entity';

// 模块
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { MemberModule } from './modules/member/member.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ServiceModule } from './modules/service/service.module';
import { CardModule } from './modules/card/card.module';
import { OrderModule } from './modules/order/order.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { StaffModule } from './modules/staff/staff.module';
import { NoticeModule } from './modules/notice/notice.module';
import { PlatformModule } from './modules/platform/platform.module';
import { StockModule } from './modules/stock/stock.module';
import { WebsiteModule } from './modules/website/website.module';
import { ReportModule } from './modules/report/report.module';

// 守卫
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_DATABASE || 'store_saas',
      entities: [
        Tenant, User, Member, Appointment, ServiceItem, Staff,
        Card, CardRecord, Order, OrderItem, Coupon, MemberCoupon, Notice,
        MemberLevel, PointsRecord, RechargeRecord, StockProduct,
        MarketingActivity, TenantWebsite, OperationLog
      ],
      synchronize: true, // 开发环境自动建表，生产环境请用迁移
      timezone: '+08:00',
    }),
    AuthModule,
    TenantModule,
    MemberModule,
    AppointmentModule,
    ServiceModule,
    CardModule,
    OrderModule,
    MarketingModule,
    DashboardModule,
    StaffModule,
    NoticeModule,
    PlatformModule,
    StockModule,
    WebsiteModule,
    ReportModule,
  ],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
  ],
})
export class AppModule {}
