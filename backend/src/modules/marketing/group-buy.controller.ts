import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { GroupBuyService } from './group-buy.service';
import { Public } from '../../common/guards/public.decorator';

@Controller('group-buy')
export class GroupBuyController {
  constructor(private groupBuyService: GroupBuyService) {}

  // 店铺后台：活动列表
  @Get()
  findAll(@Req() req, @Query() query) {
    return this.groupBuyService.findAll(req.user.tenantId, query);
  }

  // 店铺后台：创建活动
  @Post()
  create(@Req() req, @Body() body) {
    return this.groupBuyService.create(req.user.tenantId, body);
  }

  // 店铺后台：更新活动
  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() body) {
    return this.groupBuyService.update(req.user.tenantId, +id, body);
  }

  // 店铺后台：删除活动
  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.groupBuyService.delete(req.user.tenantId, +id);
  }

  // 公开接口：获取进行中的活动（小程序用）
  @Public()
  @Get('public/:tenantId')
  getPublicActivities(@Param('tenantId') tenantId: string) {
    return this.groupBuyService.getPublicActivities(+tenantId);
  }

  // 公开接口：开团
  @Public()
  @Post('public/:tenantId/create-group')
  createGroup(
    @Param('tenantId') tenantId: string,
    @Body() body: { activityId: number; memberId: number; memberName: string }
  ) {
    return this.groupBuyService.createGroup(+tenantId, body.activityId, body.memberId, body.memberName);
  }

  // 公开接口：参团
  @Public()
  @Post('public/:tenantId/join-group/:groupId')
  joinGroup(
    @Param('tenantId') tenantId: string,
    @Param('groupId') groupId: string,
    @Body() body: { memberId: number; memberName: string }
  ) {
    return this.groupBuyService.joinGroup(+tenantId, +groupId, body.memberId, body.memberName);
  }
}
