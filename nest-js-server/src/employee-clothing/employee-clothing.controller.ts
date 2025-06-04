import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmployeeClothingService } from './employee-clothing.service';
import { IssueClothingDto } from './dto/issue-clothing.dto';

@Controller('employee-clothing')
export class EmployeeClothingController {
  constructor(
    private readonly employeeClothingService: EmployeeClothingService,
  ) {}

  @Post('issue/:id')
  async issueClothing(
    @Param('id') employeeId: string,
    @Body() dto: IssueClothingDto,
  ) {
    return this.employeeClothingService.issueClothing(employeeId, dto);
  }

  @Get('debt/:id')
  async getDebtDetails(@Param('id') employeeId: string) {
    return this.employeeClothingService.getEmployeeDebtDetails(employeeId);
  }
}
