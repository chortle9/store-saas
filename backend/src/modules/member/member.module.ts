import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { MemberLevel } from './member-level.entity';
import { PointsRecord } from './points-record.entity';
import { RechargeRecord } from './recharge-record.entity';
import { Order } from '../order/order.entity';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { MemberLevelService } from './member-level.service';
import { MemberLevelController } from './member-level.controller';
import { PointsService } from './points.service';
import { RechargeService } from './recharge.service';
import { MemberTierService } from './tier.service';
import { MemberTierController } from './tier.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Member, MemberLevel, PointsRecord, RechargeRecord, Order])],
  providers: [MemberService, MemberLevelService, PointsService, RechargeService, MemberTierService],
  controllers: [MemberController, MemberLevelController, MemberTierController],
  exports: [MemberService, PointsService, RechargeService, MemberTierService],
})
export class MemberModule {}
