import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Get()
  findAll(@Req() req) {
    return this.staffService.findAll(req.user.tenantId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.staffService.findOne(req.user.tenantId, +id);
  }

  @Post()
  create(@Req() req, @Body() body) {
    return this.staffService.create(req.user.tenantId, body);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() body) {
    return this.staffService.update(req.user.tenantId, +id, body);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.staffService.remove(req.user.tenantId, +id);
  }
}
