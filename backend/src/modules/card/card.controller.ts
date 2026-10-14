import { Controller, Get, Post, Put, Body, Param, Req } from '@nestjs/common';
import { CardService } from './card.service';

@Controller('cards')
export class CardController {
  constructor(private cardService: CardService) {}

  // 卡项模板
  @Get()
  findAll(@Req() req) {
    return this.cardService.findAll(req.user.tenantId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.cardService.findOne(req.user.tenantId, +id);
  }

  @Post()
  create(@Req() req, @Body() body) {
    return this.cardService.create(req.user.tenantId, body);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() body) {
    return this.cardService.update(req.user.tenantId, +id, body);
  }

  // 会员持卡
  @Get('member/:memberId')
  getMemberCards(@Req() req, @Param('memberId') memberId: string) {
    return this.cardService.getMemberCards(req.user.tenantId, +memberId);
  }

  @Post('issue')
  issueCard(@Req() req, @Body() body: { memberId: number; cardId: number }) {
    return this.cardService.issueCard(req.user.tenantId, body.memberId, body.cardId);
  }
}
