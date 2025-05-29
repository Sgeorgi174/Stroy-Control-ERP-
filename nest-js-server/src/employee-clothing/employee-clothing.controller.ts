import { Controller } from '@nestjs/common';
import { EmployeeClothingService } from './employee-clothing.service';

@Controller('employee-clothing')
export class EmployeeClothingController {
  constructor(
    private readonly employeeClothingService: EmployeeClothingService,
  ) {}
}
