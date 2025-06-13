import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { DeviceHistoryModule } from 'src/device-history/device-history.module';

@Module({
  imports: [DeviceHistoryModule],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
