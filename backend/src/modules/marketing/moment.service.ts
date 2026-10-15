import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MomentMaterial } from './moment.entity';

@Injectable()
export class MomentService {
  constructor(
    @InjectRepository(MomentMaterial)
    private momentRepo: Repository<MomentMaterial>,
  ) {}

  // 素材列表
  async findAll(tenantId: number) {
    return this.momentRepo.find({
      where: { tenantId, status: 1 },
      order: { createdAt: 'DESC' },
    });
  }

  // 创建素材
  async create(tenantId: number, data: Partial<MomentMaterial>) {
    const moment = this.momentRepo.create({ ...data, tenantId });
    return this.momentRepo.save(moment);
  }

  // 删除素材
  async delete(tenantId: number, id: number) {
    return this.momentRepo.delete({ id, tenantId });
  }

  // 公开接口：获取今日推荐发圈内容（员工手机端用）
  async getTodayMoment(tenantId: number) {
    const all = await this.momentRepo.find({
      where: { tenantId, status: 1 },
    });
    if (all.length === 0) return null;
    // 每天随机选一条
    const today = new Date().getDate();
    return all[today % all.length];
  }
}
