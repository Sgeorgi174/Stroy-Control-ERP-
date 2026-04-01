import { Module } from '@nestjs/common';
import { ClothesRequestService } from './clothes-request.service';
import { ClothesRequestController } from './clothes-request.controller';
import { ClothesRequestStatusService } from './clothes-request-status.service';
import { MaxBotModule } from 'src/max-bot/max-bot.module';

@Module({
  imports: [MaxBotModule],
  controllers: [ClothesRequestController],
  providers: [ClothesRequestService, ClothesRequestStatusService],
})
export class ClothesRequestModule {}
