import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ServiceItem } from './service-item.entity';

@Injectable()
export class ServiceItemService {
  constructor(
    @InjectRepository(ServiceItem)
    private serviceRepo: Repository<ServiceItem>,
  ) {}

  async findAll(tenantId: number, query: { keyword?: string; status?: number; category?: string }) {
    const where: any = { tenantId };
    if (query.keyword) where.name = Like(`%${query.keyword}%`);
    if (query.status !== undefined) where.status = query.status;
    if (query.category) where.category = query.category;

    return this.serviceRepo.find({
      where,
      order: { sort: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(tenantId: number, id: number) {
    const item = await this.serviceRepo.findOne({ where: { id, tenantId } });
    if (!item) throw new NotFoundException('项目不存在');
    return item;
  }

  async create(tenantId: number, data: Partial<ServiceItem>) {
    const item = this.serviceRepo.create({ ...data, tenantId });
    return this.serviceRepo.save(item);
  }

  async update(tenantId: number, id: number, data: Partial<ServiceItem>) {
    const item = await this.findOne(tenantId, id);
    Object.assign(item, data);
    return this.serviceRepo.save(item);
  }

  async remove(tenantId: number, id: number) {
    await this.serviceRepo.update({ id, tenantId }, { status: 0 });
    return { success: true };
  }

  async findByTenant(tenantId: number) {
    return this.serviceRepo.find({
      where: { tenantId, status: 1 },
      order: { sort: 'ASC' },
    });
  }
}
