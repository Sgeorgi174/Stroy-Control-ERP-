import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { ToolHistoryModule } from 'src/tool-history/tool-history.module';
import { UserModule } from 'src/user/user.module';
import { MaxBotModule } from 'src/max-bot/max-bot.module';
import { ToolBrandService } from './tool-brand.service';
import { ToolBrandController } from './tool-brand.controller';

@Module({
  imports: [ToolHistoryModule, UserModule, MaxBotModule],
  controllers: [ToolController, ToolBrandController],
  providers: [ToolService, ToolBrandService],
})
export class ToolModule {}
