import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { DeviceHistoryModule } from 'src/device-history/device-history.module';
import { UserModule } from 'src/user/user.module';
import { TelegramBotModule } from 'src/telegram-bot/telegram-bot.module';

@Module({
  imports: [DeviceHistoryModule, UserModule, TelegramBotModule],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
