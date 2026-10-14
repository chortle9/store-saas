import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/order.entity';
import { Member } from '../member/member.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Staff } from '../staff/staff.entity';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Member, Appointment, Staff])],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
