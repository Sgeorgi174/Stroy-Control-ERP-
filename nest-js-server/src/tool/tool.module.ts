import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { ToolHistoryModule } from 'src/tool-history/tool-history.module';
import { UserModule } from 'src/user/user.module';
import { TelegramBotModule } from 'src/telegram-bot/telegram-bot.module';

@Module({
  imports: [ToolHistoryModule, UserModule, TelegramBotModule],
  controllers: [ToolController],
  providers: [ToolService],
})
export class ToolModule {}
