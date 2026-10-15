import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common';
import { ReferralService } from './referral.service';

@Controller('referral')
export class ReferralController {
  constructor(private referralService: ReferralService) {}

  // 转介绍列表
  @Get()
  findAll(@Req() req, @Query() query) {
    return this.referralService.findAll(req.user.tenantId, query);
  }

  // 推荐统计
  @Get('stats')
  getStats(@Req() req) {
    return this.referralService.getStats(req.user.tenantId);
  }

  // 绑定推荐人
  @Post('bind')
  bindReferrer(@Req() req, @Body() body: { referrerId: number; refereeId: number; refereeName: string }) {
    return this.referralService.bindReferrer(req.user.tenantId, body.referrerId, body.refereeId, body.refereeName);
  }
}
