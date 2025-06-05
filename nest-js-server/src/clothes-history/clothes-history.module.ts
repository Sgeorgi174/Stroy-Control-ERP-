import { Module } from '@nestjs/common';
import { ClothesHistoryService } from './clothes-history.service';
import { ClothesHistoryController } from './clothes-history.controller';

@Module({
  controllers: [ClothesHistoryController],
  providers: [ClothesHistoryService],
  exports: [ClothesHistoryService],
})
export class ClothesHistoryModule {}
