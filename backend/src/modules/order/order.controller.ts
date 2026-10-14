import { Controller, Get, Post, Put, Body, Param, Query, Req } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  findAll(@Req() req, @Query() query) {
    return this.orderService.findAll(req.user.tenantId, query);
  }

  @Get('today-revenue')
  getTodayRevenue(@Req() req) {
    return this.orderService.getTodayRevenue(req.user.tenantId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.orderService.findOne(req.user.tenantId, +id);
  }

  @Post()
  create(@Req() req, @Body() body) {
    return this.orderService.create(req.user.tenantId, body);
  }

  @Put(':id/refund')
  refund(@Req() req, @Param('id') id: string, @Body() body: { reason: string }) {
    return this.orderService.refund(req.user.tenantId, +id, body.reason);
  }
}
