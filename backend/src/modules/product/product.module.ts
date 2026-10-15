import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { PurchaseRecord } from './purchase.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, PurchaseRecord])],
  providers: [ProductService, PurchaseService],
  controllers: [ProductController, PurchaseController],
  exports: [ProductService],
})
export class ProductModule {}
