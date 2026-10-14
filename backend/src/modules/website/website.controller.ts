import { Controller, Get, Put, Post, Body, Req, Param } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { ServiceItemService } from '../service/service-item.service';
import { AppointmentService } from '../appointment/appointment.service';
import { Public } from '../../common/guards/public.decorator';

@Controller('website')
export class WebsiteController {
  constructor(
    private websiteService: WebsiteService,
    private serviceItemService: ServiceItemService,
    private appointmentService: AppointmentService,
  ) {}

  // 店铺后台：获取/编辑自己的网站配置（全局守卫自动拦截）
  @Get()
  getMyWebsite(@Req() req) {
    return this.websiteService.getWebsite(req.user.tenantId);
  }

  @Put()
  updateMyWebsite(@Req() req, @Body() body) {
    return this.websiteService.updateWebsite(req.user.tenantId, body);
  }

  // 公开接口：根据租户ID获取网站（H5前台用）
  @Public()
  @Get('public/:tenantId')
  getPublicWebsite(@Param('tenantId') tenantId: string) {
    return this.websiteService.getPublicWebsite(+tenantId);
  }

  // 公开接口：获取租户的服务项目
  @Public()
  @Get('public/:tenantId/services')
  getPublicServices(@Param('tenantId') tenantId: string) {
    return this.serviceItemService.findByTenant(+tenantId);
  }

  // 公开接口：小程序提交预约
  @Public()
  @Post('public/:tenantId/appointments')
  createPublicAppointment(@Param('tenantId') tenantId: string, @Body() body) {
    return this.appointmentService.create(+tenantId, body);
  }
}
