import { Controller, Get, Post, Put, Body, Param, Query, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from '../../common/guards/public.decorator';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  // 创建支付单
  @Post()
  createPayment(@Req() req, @Body() body) {
    return this.paymentService.createPayment(req.user.tenantId, body);
  }

  // 模拟支付成功（开发环境用）
  @Post('mock-pay/:paymentNo')
  mockPay(@Req() req, @Param('paymentNo') paymentNo: string) {
    return this.paymentService.mockPaySuccess(req.user.tenantId, paymentNo);
  }

  // 支付记录列表
  @Get()
  findAll(@Req() req, @Query() query) {
    return this.paymentService.findAll(req.user.tenantId, query);
  }

  // 退款
  @Put('refund/:paymentNo')
  refund(@Req() req, @Param('paymentNo') paymentNo: string, @Body() body: { reason: string }) {
    return this.paymentService.refund(req.user.tenantId, paymentNo, body.reason);
  }

  // 支付回调（公开接口，微信/支付宝调用）
  @Public()
  @Post('callback')
  handleCallback(@Body() body) {
    return this.paymentService.handleCallback(body);
  }
}
