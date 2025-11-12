import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { EmployeeStatusService } from './employee-status.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeStatusService],
})
export class EmployeeModule {}
