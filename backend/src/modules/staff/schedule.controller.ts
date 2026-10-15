import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedules')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  // 获取周排班表
  @Get()
  getWeekSchedule(@Req() req, @Query('weekStart') weekStart: string) {
    return this.scheduleService.getWeekSchedule(req.user.tenantId, weekStart);
  }

  // 保存排班
  @Post()
  saveSchedule(@Req() req, @Body() body) {
    return this.scheduleService.saveSchedule(req.user.tenantId, body);
  }

  // 复制上周排班
  @Post('copy-last-week')
  copyLastWeek(@Req() req, @Body() body: { targetWeekStart: string }) {
    return this.scheduleService.copyLastWeek(req.user.tenantId, body.targetWeekStart);
  }
}
