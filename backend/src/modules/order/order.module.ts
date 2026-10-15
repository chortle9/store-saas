import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { ShiftRecord } from './shift.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { VerifyService } from './verify.service';
import { VerifyController } from './verify.controller';
import { CommissionModule } from '../commission/commission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, ShiftRecord]), CommissionModule],
  providers: [OrderService, ShiftService, VerifyService],
  controllers: [OrderController, ShiftController, VerifyController],
  exports: [OrderService],
})
export class OrderModule {}
