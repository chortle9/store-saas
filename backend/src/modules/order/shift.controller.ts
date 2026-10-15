import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ShiftService } from './shift.service';

@Controller('shifts')
export class ShiftController {
  constructor(private shiftService: ShiftService) {}

  // 当前班次统计
  @Get('current-stats')
  getCurrentStats(@Req() req) {
    return this.shiftService.getCurrentShiftStats(req.user.tenantId, req.user.id);
  }

  // 交班
  @Post('checkout')
  checkout(@Req() req, @Body() body: { remark: string }) {
    return this.shiftService.doShift(req.user.tenantId, req.user.id, req.user.realName, body.remark);
  }

  // 交班记录
  @Get('history')
  getHistory(@Req() req) {
    return this.shiftService.getShiftHistory(req.user.tenantId);
  }
}
