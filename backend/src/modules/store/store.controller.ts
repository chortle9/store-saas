import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { StoreService } from './store.service';
import { Public } from '../../common/guards/public.decorator';

@Controller('stores')
export class StoreController {
  constructor(private storeService: StoreService) {}

  // 店铺后台：门店列表
  @Get()
  findAll(@Req() req) {
    return this.storeService.findAll(req.user.tenantId);
  }

  // 店铺后台：创建门店
  @Post()
  create(@Req() req, @Body() body) {
    return this.storeService.create(req.user.tenantId, body);
  }

  // 店铺后台：更新门店
  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() body) {
    return this.storeService.update(req.user.tenantId, +id, body);
  }

  // 店铺后台：删除门店
  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.storeService.delete(req.user.tenantId, +id);
  }

  // 公开接口：获取营业门店（小程序用）
  @Public()
  @Get('public/:tenantId')
  getPublicStores(@Param('tenantId') tenantId: string) {
    return this.storeService.getPublicStores(+tenantId);
  }
}
