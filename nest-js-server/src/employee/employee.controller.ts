import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'generated/prisma';
import { GetEmployeeQueryDto } from './dto/employee-query.dto';
import { TransferEmployeeDto } from './dto/transfer.dto';
import { AssignEmployeesDto } from './dto/assign-employees.dto';
import { AddSkillsDto } from './dto/add-skill.dto';
import { RemoveSkillsDto } from './dto/remove-skill.dto';
import { ArchiveDto } from './dto/archive-employee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Authorization(Roles.OWNER)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateDto) {
    return this.employeeService.create(dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('filter')
  async getFiltered(@Query() query: GetEmployeeQueryDto) {
    return this.employeeService.getFiltered(query);
  }

  @Authorization(Roles.OWNER)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.employeeService.getById(id);
  }

  @Authorization(Roles.OWNER)
  @Get('free-employees')
  async getFreeEmployees() {
    return this.employeeService.getFreeEmployees();
  }

  @Authorization(Roles.OWNER)
  @Post('assign')
  async assignEmployeesToObject(@Body() dto: AssignEmployeesDto) {
    return this.employeeService.assignToObject(dto);
  }

  @Authorization(Roles.OWNER)
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateDto) {
    return this.employeeService.update(id, dto);
  }

  @Authorization(Roles.OWNER)
  @Patch('transfer/:id')
  async transfer(@Param('id') id: string, @Body() dto: TransferEmployeeDto) {
    return this.employeeService.transfer(id, dto);
  }

  @Authorization(Roles.OWNER)
  @Post('add-skills/:id')
  async addSkills(@Param('id') employeeId: string, @Body() dto: AddSkillsDto) {
    return this.employeeService.addSkillsToEmployee(employeeId, dto);
  }

  @Authorization(Roles.OWNER)
  @Patch('remove-skill/:id')
  async removeSkill(
    @Param('id') employeeId: string,
    @Body() dto: RemoveSkillsDto,
  ) {
    return this.employeeService.removeSkillFromEmployee(employeeId, dto);
  }

  @Authorization(Roles.OWNER)
  @Patch('archive/:id')
  async archiveEmployee(@Param('id') id: string, dto: ArchiveDto) {
    return this.employeeService.archiveEmployee(id, dto);
  }

  @Authorization(Roles.OWNER)
  @Patch('restore/:id')
  async restoreEmployee(@Param('id') id: string) {
    return this.employeeService.restoreEmployee(id);
  }

  @Authorization(Roles.OWNER)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.employeeService.delete(id);
  }
}
