import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardRecord } from './card-record.entity';
import { CardService } from './card.service';
import { CardController } from './card.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Card, CardRecord])],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
