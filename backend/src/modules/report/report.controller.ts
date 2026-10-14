import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get('revenue-daily')
  revenueDaily(@Req() req, @Query('days') days: string) {
    return this.reportService.revenueDaily(req.user.tenantId, +days || 30);
  }

  @Get('staff-performance')
  staffPerformance(@Req() req) {
    return this.reportService.staffPerformance(req.user.tenantId);
  }

  @Get('member-analysis')
  memberAnalysis(@Req() req) {
    return this.reportService.memberAnalysis(req.user.tenantId);
  }
}
