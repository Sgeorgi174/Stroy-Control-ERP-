import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { DeviceHistoryModule } from 'src/device-history/device-history.module';
import { UserModule } from 'src/user/user.module';
import { MaxBotModule } from 'src/max-bot/max-bot.module';

@Module({
  imports: [DeviceHistoryModule, UserModule, MaxBotModule],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
