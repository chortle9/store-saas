import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './coupon.entity';
import { MemberCoupon } from './member-coupon.entity';
import { GroupBuyActivity } from './group-buy.entity';
import { GroupBuyOrder } from './group-buy-order.entity';
import { BargainActivity } from './bargain.entity';
import { BargainRecord } from './bargain-record.entity';
import { ReferralRecord } from './referral.entity';
import { AutoRule } from './auto-rule.entity';
import { Member } from '../member/member.entity';
import { ServiceItem } from '../service/service-item.entity';
import { MomentMaterial } from './moment.entity';
import { MomentService } from './moment.service';
import { MomentController } from './moment.controller';
import { MarketingService } from './marketing.service';
import { MarketingController } from './marketing.controller';
import { GroupBuyService } from './group-buy.service';
import { GroupBuyController } from './group-buy.controller';
import { BargainService } from './bargain.service';
import { BargainController } from './bargain.controller';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { AutoRuleService } from './auto-rule.service';
import { AutoRuleController } from './auto-rule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    Coupon, MemberCoupon,
    GroupBuyActivity, GroupBuyOrder,
    BargainActivity, BargainRecord,
    ReferralRecord,
    AutoRule, Member,
    ServiceItem,
    MomentMaterial
  ])],
  providers: [MarketingService, GroupBuyService, BargainService, ReferralService, AutoRuleService, MomentService],
  controllers: [MarketingController, GroupBuyController, BargainController, ReferralController, AutoRuleController, MomentController],
  exports: [MarketingService, GroupBuyService, BargainService, ReferralService, AutoRuleService, MomentService],
})
export class MarketingModule {}
