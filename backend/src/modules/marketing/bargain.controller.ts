import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { BargainService } from './bargain.service';
import { Public } from '../../common/guards/public.decorator';

@Controller('bargain')
export class BargainController {
  constructor(private bargainService: BargainService) {}

  // 店铺后台：活动列表
  @Get()
  findAll(@Req() req, @Query() query) {
    return this.bargainService.findAll(req.user.tenantId, query);
  }

  // 店铺后台：创建活动
  @Post()
  create(@Req() req, @Body() body) {
    return this.bargainService.create(req.user.tenantId, body);
  }

  // 店铺后台：更新活动
  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() body) {
    return this.bargainService.update(req.user.tenantId, +id, body);
  }

  // 店铺后台：删除活动
  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.bargainService.delete(req.user.tenantId, +id);
  }

  // 公开接口：获取进行中的活动
  @Public()
  @Get('public/:tenantId')
  getPublicActivities(@Param('tenantId') tenantId: string) {
    return this.bargainService.getPublicActivities(+tenantId);
  }

  // 公开接口：发起砍价
  @Public()
  @Post('public/:tenantId/start')
  startBargain(
    @Param('tenantId') tenantId: string,
    @Body() body: { activityId: number; userId: number; userName: string }
  ) {
    return this.bargainService.startBargain(+tenantId, body.activityId, body.userId, body.userName);
  }

  // 公开接口：帮忙砍价
  @Public()
  @Post('public/:tenantId/help/:recordId')
  helpBargain(
    @Param('tenantId') tenantId: string,
    @Param('recordId') recordId: string
  ) {
    return this.bargainService.helpBargain(+tenantId, +recordId);
  }
}
