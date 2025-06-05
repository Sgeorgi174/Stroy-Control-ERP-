import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { ToolHistoryModule } from 'src/tool-history/tool-history.module';

@Module({
  imports: [ToolHistoryModule],
  controllers: [ToolController],
  providers: [ToolService],
})
export class ToolModule {}
