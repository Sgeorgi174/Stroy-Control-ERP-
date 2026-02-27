import { Module } from '@nestjs/common';
import { ClothesRequestService } from './clothes-request.service';
import { ClothesRequestController } from './clothes-request.controller';
import { TelegramBotModule } from 'src/telegram-bot/telegram-bot.module';
import { ClothesRequestStatusService } from './clothes-request-status.service';

@Module({
  imports: [TelegramBotModule],
  controllers: [ClothesRequestController],
  providers: [ClothesRequestService, ClothesRequestStatusService],
})
export class ClothesRequestModule {}
