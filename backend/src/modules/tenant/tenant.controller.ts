import { Controller, Get, Put, Body, Req } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Get('info')
  getInfo(@Req() req) {
    return this.tenantService.findOne(req.user.tenantId);
  }

  @Put('info')
  updateInfo(@Req() req, @Body() body) {
    return this.tenantService.update(req.user.tenantId, body);
  }
}
