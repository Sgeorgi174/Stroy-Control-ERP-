import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EmployeeClothingService } from './employee-clothing.service';
import { IssueClothingDto } from './dto/issue-clothing.dto';
import { ChangeDebtDto } from './dto/change-debt.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from '@prisma/client';
import { UpdateIssuedClothingDto } from './dto/update-issued-clothing.dto';
import { IssueCustomClothingDto } from './dto/issue-custom-slothing.dto';

@Controller('employee-clothing')
export class EmployeeClothingController {
  constructor(
    private readonly employeeClothingService: EmployeeClothingService,
  ) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Post('issue/:id')
  async issueClothing(
    @Param('id') employeeId: string,
    @Body() dto: IssueClothingDto,
  ) {
    return this.employeeClothingService.issueClothing(employeeId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Post('issue-custom/:id')
  async issueCustomClothing(
    @Param('id') employeeId: string,
    @Body() dto: IssueCustomClothingDto,
  ) {
    return this.employeeClothingService.issueCustomClothing(employeeId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Get('debt/:id')
  async getDebtDetails(@Param('id') employeeId: string) {
    return this.employeeClothingService.getEmployeeDebtDetails(employeeId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Patch('change-debt/:recordId')
  async changeDebt(
    @Param('recordId') recordId: string,
    @Body() dto: ChangeDebtDto,
  ) {
    return this.employeeClothingService.changeDebt(recordId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Patch('update/:recordId')
  async updateIssuedClothing(
    @Param('recordId') recordId: string,
    @Body() dto: UpdateIssuedClothingDto,
  ) {
    return this.employeeClothingService.updateIssuedClothing(recordId, dto);
  }

  @Authorization(Roles.MASTER, Roles.OWNER, Roles.ACCOUNTANT, Roles.ADMIN)
  @Delete('custom/:recordId')
  async deleteCustomClothing(@Param('recordId') recordId: string) {
    return this.employeeClothingService.deleteCustomClothing(recordId);
  }
}
