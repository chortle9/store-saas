import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './staff.entity';
import { StaffSchedule } from './schedule.entity';
import { User } from './user.entity';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, StaffSchedule, User])],
  providers: [StaffService, ScheduleService],
  controllers: [StaffController, ScheduleController],
  exports: [StaffService, ScheduleService],
})
export class StaffModule {}
