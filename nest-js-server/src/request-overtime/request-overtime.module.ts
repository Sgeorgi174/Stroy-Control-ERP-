import { Module } from '@nestjs/common';
import { RequestOvertimeService } from './request-overtime.service';
import { RequestOvertimeController } from './request-overtime.controller';

@Module({
  controllers: [RequestOvertimeController],
  providers: [RequestOvertimeService],
})
export class RequestOvertimeModule {}
