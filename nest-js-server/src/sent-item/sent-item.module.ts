import { Module } from '@nestjs/common';
import { SentItemsService } from './sent-item.service';
import { SentItemsController } from './sent-item.controller';

@Module({
  controllers: [SentItemsController],
  providers: [SentItemsService],
})
export class SentItemModule {}
