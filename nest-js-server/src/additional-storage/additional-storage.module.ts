import { Module } from '@nestjs/common';
import { AdditionalStorageService } from './additional-storage.service';
import { AdditionalStorageController } from './additional-storage.controller';

@Module({
  controllers: [AdditionalStorageController],
  providers: [AdditionalStorageService],
})
export class AdditionalStorageModule {}
