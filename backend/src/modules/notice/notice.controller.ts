import { Controller, Get, Put, Param, Req } from '@nestjs/common';
import { NoticeService } from './notice.service';

@Controller('notices')
export class NoticeController {
  constructor(private noticeService: NoticeService) {}

  @Get('my')
  getMyNotices(@Req() req) {
    return this.noticeService.getMyNotices(
      req.user.tenantId,
      'staff',
      req.user.sub,
    );
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.noticeService.markAsRead(+id);
  }
}
