import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockProduct } from './stock-product.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockProduct)
    private productRepo: Repository<StockProduct>,
  ) {}

  async findAll(tenantId: number, params: any) {
    const { page = 1, pageSize = 20, keyword = '' } = params;
    const where: any = { tenantId };
    if (keyword) where.name = new RegExp(keyword);

    const [list, total] = await this.productRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total };
  }

  async create(tenantId: number, data: Partial<StockProduct>) {
    const product = this.productRepo.create({ ...data, tenantId });
    return this.productRepo.save(product);
  }

  async update(tenantId: number, id: number, data: Partial<StockProduct>) {
    await this.productRepo.update({ id, tenantId }, data);
    return this.productRepo.findOne({ where: { id, tenantId } });
  }

  async delete(tenantId: number, id: number) {
    await this.productRepo.delete({ id, tenantId });
    return { success: true };
  }

  async lowStockList(tenantId: number) {
    const products = await this.productRepo.find({ where: { tenantId } });
    return products.filter(p => p.stock <= p.warnStock);
  }
}
