import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TelegramBotModule } from 'src/telegram-bot/telegram-bot.module';

@Module({
  imports: [TelegramBotModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
