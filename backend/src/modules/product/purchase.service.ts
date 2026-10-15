import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseRecord } from './purchase.entity';
import { Product } from './product.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(PurchaseRecord)
    private purchaseRepo: Repository<PurchaseRecord>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  // 采购入库
  async stockIn(tenantId: number, data: { productId: number; quantity: number; costPrice: number; supplier: string }) {
    // 1. 记录采购单
    const product = await this.productRepo.findOne({ where: { id: data.productId, tenantId } });
    if (!product) throw new Error('商品不存在');

    await this.purchaseRepo.save({
      tenantId,
      productId: data.productId,
      productName: product.name,
      quantity: data.quantity,
      costPrice: data.costPrice,
      totalAmount: data.quantity * data.costPrice,
      supplier: data.supplier,
    });

    // 2. 加库存
    product.stock += data.quantity;
    product.costPrice = data.costPrice;
    await this.productRepo.save(product);

    return { success: true, message: '入库成功' };
  }

  // 采购记录列表
  async getRecords(tenantId: number) {
    return this.purchaseRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
