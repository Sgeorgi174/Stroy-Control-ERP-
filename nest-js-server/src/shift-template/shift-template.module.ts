import { Module } from '@nestjs/common';
import { ShiftTemplateService } from './shift-template.service';
import { ShiftTemplateController } from './shift-template.controller';

@Module({
  controllers: [ShiftTemplateController],
  providers: [ShiftTemplateService],
})
export class ShiftTemplateModule {}
