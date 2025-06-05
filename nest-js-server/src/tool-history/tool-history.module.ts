import { Module } from '@nestjs/common';
import { ToolHistoryService } from './tool-history.service';
import { ToolHistoryController } from './tool-history.controller';

@Module({
  controllers: [ToolHistoryController],
  providers: [ToolHistoryService],
  exports: [ToolHistoryService],
})
export class ToolHistoryModule {}
