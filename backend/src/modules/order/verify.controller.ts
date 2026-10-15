import { Controller, Post, Body, Req } from '@nestjs/common';
import { VerifyService } from './verify.service';

@Controller('verify')
export class VerifyController {
  constructor(private verifyService: VerifyService) {}

  // 核销订单
  @Post('order')
  verifyOrder(@Req() req, @Body() body: { verifyCode: string }) {
    return this.verifyService.verifyOrder(req.user.tenantId, body.verifyCode);
  }
}
