import { Controller, Get, Post, Delete, Body, Param, Req } from '@nestjs/common';
import { MomentService } from './moment.service';
import { Public } from '../../common/guards/public.decorator';

@Controller('moments')
export class MomentController {
  constructor(private momentService: MomentService) {}

  // 素材列表
  @Get()
  findAll(@Req() req) {
    return this.momentService.findAll(req.user.tenantId);
  }

  // 创建素材
  @Post()
  create(@Req() req, @Body() body) {
    return this.momentService.create(req.user.tenantId, body);
  }

  // 删除素材
  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.momentService.delete(req.user.tenantId, +id);
  }

  // 公开接口：今日推荐发圈
  @Public()
  @Get('public/:tenantId/today')
  getTodayMoment(@Param('tenantId') tenantId: string) {
    return this.momentService.getTodayMoment(+tenantId);
  }
}
