import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get('products')
  findAll(@Req() req, @Query() query) {
    return this.stockService.findAll(req.user.tenantId, query);
  }

  @Get('low-stock')
  lowStock(@Req() req) {
    return this.stockService.lowStockList(req.user.tenantId);
  }

  @Post('products')
  create(@Req() req, @Body() body) {
    return this.stockService.create(req.user.tenantId, body);
  }

  @Put('products/:id')
  update(@Req() req, @Param('id') id: string, @Body() body) {
    return this.stockService.update(req.user.tenantId, +id, body);
  }

  @Delete('products/:id')
  delete(@Req() req, @Param('id') id: string) {
    return this.stockService.delete(req.user.tenantId, +id);
  }
}
