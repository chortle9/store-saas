import { Controller, Get, Post, Put, Body, Param, Query, Req } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Get()
  findAll(@Req() req, @Query() query) {
    return this.appointmentService.findAll(req.user.tenantId, query);
  }

  @Get('today')
  getToday(@Req() req) {
    return this.appointmentService.getTodayAppointments(req.user.tenantId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.appointmentService.findOne(req.user.tenantId, +id);
  }

  @Post()
  create(@Req() req, @Body() body) {
    return this.appointmentService.create(req.user.tenantId, body);
  }

  @Put(':id/status')
  updateStatus(@Req() req, @Param('id') id: string, @Body() body: { status: string; remark?: string }) {
    return this.appointmentService.updateStatus(req.user.tenantId, +id, body.status, body.remark);
  }
}
