import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { PurchaseService } from './purchase.service';

@Controller('purchases')
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  // 采购入库
  @Post('stock-in')
  stockIn(@Req() req, @Body() body) {
    return this.purchaseService.stockIn(req.user.tenantId, body);
  }

  // 采购记录
  @Get('records')
  getRecords(@Req() req) {
    return this.purchaseService.getRecords(req.user.tenantId);
  }
}
