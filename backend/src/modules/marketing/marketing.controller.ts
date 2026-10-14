import { Controller, Get, Post, Put, Body, Param, Query, Req } from '@nestjs/common';
import { MarketingService } from './marketing.service';

@Controller('marketing')
export class MarketingController {
  constructor(private marketingService: MarketingService) {}

  // 优惠券模板
  @Get('coupons')
  findAllCoupons(@Req() req) {
    return this.marketingService.findAllCoupons(req.user.tenantId);
  }

  @Post('coupons')
  createCoupon(@Req() req, @Body() body) {
    return this.marketingService.createCoupon(req.user.tenantId, body);
  }

  @Put('coupons/:id')
  updateCoupon(@Req() req, @Param('id') id: string, @Body() body) {
    return this.marketingService.updateCoupon(req.user.tenantId, +id, body);
  }

  // 会员优惠券
  @Post('receive')
  receiveCoupon(@Req() req, @Body() body: { memberId: number; couponId: number }) {
    return this.marketingService.receiveCoupon(req.user.tenantId, body.memberId, body.couponId);
  }

  @Get('member-coupons/:memberId')
  getMemberCoupons(@Req() req, @Param('memberId') memberId: string, @Query('status') status?: string) {
    return this.marketingService.getMemberCoupons(req.user.tenantId, +memberId, status);
  }
}
