import { Module } from '@nestjs/common';
import { EmployeePenaltyController } from './request-penalty.controller';
import { EmployeePenaltyService } from './request-penalty.service';

@Module({
  controllers: [EmployeePenaltyController],
  providers: [EmployeePenaltyService],
})
export class RequestPenaltyModule {}
