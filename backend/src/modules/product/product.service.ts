import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async findAll(tenantId: number) {
    return this.productRepo.find({
      where: { tenantId, status: 1 },
      order: { createdAt: 'DESC' },
    });
  }

  async create(tenantId: number, data: Partial<Product>) {
    const product = this.productRepo.create({ ...data, tenantId });
    return this.productRepo.save(product);
  }

  async update(tenantId: number, id: number, data: Partial<Product>) {
    const product = await this.productRepo.findOne({ where: { id, tenantId } });
    if (!product) throw new NotFoundException('商品不存在');
    Object.assign(product, data);
    return this.productRepo.save(product);
  }

  async delete(tenantId: number, id: number) {
    return this.productRepo.delete({ id, tenantId });
  }
}
