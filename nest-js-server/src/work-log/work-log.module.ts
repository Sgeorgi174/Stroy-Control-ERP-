import { Module } from '@nestjs/common';
import { WorkLogService } from './work-log.service';
import { WorkLogController } from './work-log.controller';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [WorkLogController],
  providers: [WorkLogService],
})
export class WorkLogModule {}
