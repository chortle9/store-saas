import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantWebsite } from './website.entity';
import { ServiceItem } from '../service/service-item.entity';
import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';
import { ServiceItemService } from '../service/service-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([TenantWebsite, ServiceItem])],
  providers: [WebsiteService, ServiceItemService],
  controllers: [WebsiteController],
})
export class WebsiteModule {}
