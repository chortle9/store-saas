import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Tenant } from '../tenant/tenant.entity';
import { User } from '../staff/user.entity';
import { Member } from '../member/member.entity';
import { Order } from '../order/order.entity';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, User, Member, Order]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'store_saas_jwt_secret_2026',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  providers: [PlatformService],
  controllers: [PlatformController],
  exports: [PlatformService],
})
export class PlatformModule {}
