import { Module } from '@nestjs/common';
import { MaxBotService } from './max-bot.service';
import { MaxBotController } from './max-bot.controller';
import { BotUpdate } from './max-bot.update';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [MaxBotController],
  providers: [MaxBotService, BotUpdate],
  exports: [MaxBotService],
})
export class MaxBotModule {}
