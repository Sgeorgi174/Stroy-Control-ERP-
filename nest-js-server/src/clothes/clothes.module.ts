import { Module } from '@nestjs/common';
import { ClothesService } from './clothes.service';
import { ClothesController } from './clothes.controller';
import { ClothesHistoryModule } from 'src/clothes-history/clothes-history.module';

@Module({
  imports: [ClothesHistoryModule],
  controllers: [ClothesController],
  providers: [ClothesService],
})
export class ClothesModule {}
