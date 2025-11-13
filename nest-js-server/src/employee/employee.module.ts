import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { EmployeeStatusService } from './employee-status.service';
import { ClothingDebtCronService } from './clothing-debt.service';
import { EmployeeClothingCheckService } from './employee-clothing-check.service';
import { EmployeePassportCheckService } from './employee-passport-check.service';

@Module({
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    EmployeeStatusService,
    ClothingDebtCronService,
    EmployeeClothingCheckService,
    EmployeePassportCheckService,
  ],
  exports: [EmployeeStatusService],
})
export class EmployeeModule {}
