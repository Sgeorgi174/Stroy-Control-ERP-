import { Module } from '@nestjs/common';
import { ClothesService } from './clothes.service';
import { ClothesController } from './clothes.controller';
import { ClothesHistoryModule } from 'src/clothes-history/clothes-history.module';
import { UserModule } from 'src/user/user.module';
import { TelegramBotModule } from 'src/telegram-bot/telegram-bot.module';

@Module({
  imports: [ClothesHistoryModule, UserModule, TelegramBotModule],
  controllers: [ClothesController],
  providers: [ClothesService],
})
export class ClothesModule {}
