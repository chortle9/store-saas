import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockProduct } from './stock-product.entity';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StockProduct])],
  providers: [StockService],
  controllers: [StockController],
})
export class StockModule {}
