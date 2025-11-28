import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramBotUpdate } from './telegram-bot.update';
import { TelegramBotController } from './telegram-bot.controller';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [TelegramBotController],
  providers: [TelegramBotService, TelegramBotUpdate],
  exports: [TelegramBotService],
})
export class TelegramBotModule {}
