import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceItem } from './service-item.entity';
import { ServiceItemService } from './service-item.service';
import { ServiceItemController } from './service-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceItem])],
  providers: [ServiceItemService],
  controllers: [ServiceItemController],
  exports: [ServiceItemService],
})
export class ServiceModule {}
