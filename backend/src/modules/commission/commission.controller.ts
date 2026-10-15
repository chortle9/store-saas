import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common';
import { CommissionService } from './commission.service';

@Controller('commissions')
export class CommissionController {
  constructor(private commissionService: CommissionService) {}

  // 提成记录列表
  @Get()
  findAll(@Req() req, @Query() query) {
    return this.commissionService.findAll(req.user.tenantId, query);
  }

  // 技师提成汇总
  @Get('staff-summary')
  getStaffSummary(@Req() req, @Query() query) {
    return this.commissionService.getStaffSummary(req.user.tenantId, query);
  }

  // 结算提成
  @Post('settle')
  settle(@Req() req, @Body() body: { staffId: number; startDate: string; endDate: string }) {
    return this.commissionService.settle(req.user.tenantId, body.staffId, body.startDate, body.endDate);
  }
}
