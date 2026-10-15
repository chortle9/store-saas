import { Controller, Get, Post, Req } from '@nestjs/common';
import { MemberTierService } from './tier.service';

@Controller('member-tier')
export class MemberTierController {
  constructor(private tierService: MemberTierService) {}

  // 手动执行自动分层
  @Post('auto')
  autoTier(@Req() req) {
    return this.tierService.autoTier(req.user.tenantId);
  }

  // 分层统计
  @Get('stats')
  getStats(@Req() req) {
    return this.tierService.getTierStats(req.user.tenantId);
  }
}
