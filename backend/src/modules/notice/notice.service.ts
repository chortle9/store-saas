import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from './notice.entity';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private noticeRepo: Repository<Notice>,
  ) {}

  /**
   * 我的通知列表
   */
  async getMyNotices(tenantId: number, receiverType: string, receiverId: number) {
    return this.noticeRepo.find({
      where: { tenantId, receiverType, receiverId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  /**
   * 标记已读
   */
  async markAsRead(id: number) {
    await this.noticeRepo.update(id, { isRead: 1 });
    return { success: true };
  }

  /**
   * 创建通知
   */
  async create(data: Partial<Notice>) {
    const notice = this.noticeRepo.create(data);
    return this.noticeRepo.save(notice);
  }
}
