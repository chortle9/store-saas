import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('members')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get()
  findAll(@Req() req, @Query() query) {
    return this.memberService.findAll(req.user.tenantId, query);
  }

  @Get('follow-list')
  getFollowList(@Req() req) {
    return this.memberService.getFollowList(req.user.tenantId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.memberService.findOne(req.user.tenantId, +id);
  }

  @Post()
  create(@Req() req, @Body() body) {
    return this.memberService.create(req.user.tenantId, body);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() body) {
    return this.memberService.update(req.user.tenantId, +id, body);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.memberService.remove(req.user.tenantId, +id);
  }
}
