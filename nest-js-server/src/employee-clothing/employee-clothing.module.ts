import { Module } from '@nestjs/common';
import { EmployeeClothingService } from './employee-clothing.service';
import { EmployeeClothingController } from './employee-clothing.controller';

@Module({
  controllers: [EmployeeClothingController],
  providers: [EmployeeClothingService],
})
export class EmployeeClothingModule {}
