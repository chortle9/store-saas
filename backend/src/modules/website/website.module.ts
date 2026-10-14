import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantWebsite } from './website.entity';
import { ServiceItem } from '../service/service-item.entity';
import { Appointment } from '../appointment/appointment.entity';
import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';
import { ServiceItemService } from '../service/service-item.service';
import { AppointmentService } from '../appointment/appointment.service';

@Module({
  imports: [TypeOrmModule.forFeature([TenantWebsite, ServiceItem, Appointment])],
  providers: [WebsiteService, ServiceItemService, AppointmentService],
  controllers: [WebsiteController],
})
export class WebsiteModule {}
