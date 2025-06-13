import { Module } from '@nestjs/common';
import { TabletService } from './tablet.service';
import { TabletController } from './tablet.controller';
import { TabletHistoryModule } from 'src/tablet-history/tablet-history.module';

@Module({
  imports: [TabletHistoryModule],
  controllers: [TabletController],
  providers: [TabletService],
})
export class TabletModule {}
