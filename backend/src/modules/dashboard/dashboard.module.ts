import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../member/member.entity';
import { Order } from '../order/order.entity';
import { Appointment } from '../appointment/appointment.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Order, Appointment])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
