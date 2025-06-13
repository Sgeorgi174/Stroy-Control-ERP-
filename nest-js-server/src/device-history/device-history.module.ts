import { Module } from '@nestjs/common';
import { DeviceHistoryService } from './device-history.service';
import { DeviceHistoryController } from './device-history.controller';

@Module({
  controllers: [DeviceHistoryController],
  providers: [DeviceHistoryService],
  exports: [DeviceHistoryService],
})
export class DeviceHistoryModule {}
