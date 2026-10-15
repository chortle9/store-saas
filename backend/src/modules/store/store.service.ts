import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepo: Repository<Store>,
  ) {}

  // 获取当前租户的所有门店
  async findAll(tenantId: number) {
    return this.storeRepo.find({
      where: { tenantId },
      order: { createdAt: 'ASC' },
    });
  }

  // 创建门店
  async create(tenantId: number, data: Partial<Store>) {
    const store = this.storeRepo.create({ ...data, tenantId });
    return this.storeRepo.save(store);
  }

  // 更新门店
  async update(tenantId: number, id: number, data: Partial<Store>) {
    const store = await this.storeRepo.findOne({ where: { id, tenantId } });
    if (!store) throw new NotFoundException('门店不存在');
    Object.assign(store, data);
    return this.storeRepo.save(store);
  }

  // 删除门店
  async delete(tenantId: number, id: number) {
    return this.storeRepo.delete({ id, tenantId });
  }

  // 公开接口：获取门店列表（小程序用）
  async getPublicStores(tenantId: number) {
    return this.storeRepo.find({
      where: { tenantId, status: 1 },
    });
  }
}
