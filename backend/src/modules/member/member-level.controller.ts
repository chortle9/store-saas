import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { MemberLevelService } from './member-level.service';

@Controller('member-levels')
export class MemberLevelController {
  constructor(private levelService: MemberLevelService) {}

  @Get()
  findAll(@Req() req) {
    return this.levelService.findAll(req.user.tenantId);
  }

  @Post()
  create(@Req() req, @Body() body) {
    return this.levelService.create(req.user.tenantId, body);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() body) {
    return this.levelService.update(req.user.tenantId, +id, body);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.levelService.delete(req.user.tenantId, +id);
  }
}
