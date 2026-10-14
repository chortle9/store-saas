import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { ServiceItemService } from './service-item.service';

@Controller('services')
export class ServiceItemController {
  constructor(private serviceItemService: ServiceItemService) {}

  @Get()
  findAll(@Req() req, @Query() query) {
    return this.serviceItemService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.serviceItemService.findOne(req.user.tenantId, +id);
  }

  @Post()
  create(@Req() req, @Body() body) {
    return this.serviceItemService.create(req.user.tenantId, body);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() body) {
    return this.serviceItemService.update(req.user.tenantId, +id, body);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.serviceItemService.remove(req.user.tenantId, +id);
  }
}
