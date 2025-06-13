import { Module } from '@nestjs/common';
import { TabletHistoryService } from './tablet-history.service';
import { TabletHistoryController } from './tablet-history.controller';

@Module({
  controllers: [TabletHistoryController],
  providers: [TabletHistoryService],
  exports: [TabletHistoryService],
})
export class TabletHistoryModule {}
