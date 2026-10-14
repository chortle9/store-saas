import { Controller, Get, Post, Put, Body, Param, Query, Req } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { Public } from '../../common/guards/public.decorator';

@Controller('platform')
export class PlatformController {
  constructor(private platformService: PlatformService) {}

  @Public()
  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    console.log('=== 平台登录收到的body ===', body);
    return this.platformService.login(body.username, body.password);
  }

  @Get('stats')
  getStats() {
    return this.platformService.getPlatformStats();
  }

  @Get('tenants')
  getTenantList(@Query() query) {
    return this.platformService.getTenantList(query);
  }

  @Get('tenants/:id')
  getTenantDetail(@Param('id') id: string) {
    return this.platformService.getTenantDetail(+id);
  }

  @Post('tenants')
  createTenant(@Body() body) {
    return this.platformService.createTenant(body);
  }

  @Put('tenants/:id')
  updateTenant(@Param('id') id: string, @Body() body) {
    return this.platformService.updateTenant(+id, body);
  }
}
