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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { GetEmployeeQueryDto } from './dto/employee-query.dto';
import { TransferEmployeeDto } from './dto/transfer.dto';
import { AssignEmployeesDto } from './dto/assign-employees.dto';
import { AddSkillsDto } from './dto/add-skill.dto';
import { RemoveSkillsDto } from './dto/remove-skill.dto';
import { ArchiveDto } from './dto/archive-employee.dto';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { Roles } from '@prisma/client';
import { S3DocumentsService } from 'src/s3/s3-documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateEmployeeDocumentDto } from './dto/add-document.dto';
import { EmployeeDocumentsService } from './employee-documents.service';

@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly s3DocumentsService: S3DocumentsService,
    private readonly employeeDocumentsService: EmployeeDocumentsService,
  ) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateDto) {
    return this.employeeService.create(dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
    Roles.HR,
  )
  @Get('filter')
  async getFiltered(@Query() query: GetEmployeeQueryDto) {
    return this.employeeService.getFiltered(query);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
    Roles.FOREMAN,
  )
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.employeeService.getById(id);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Get('free-employees')
  async getFreeEmployees() {
    return this.employeeService.getFreeEmployees();
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Post('assign')
  async assignEmployeesToObject(@Body() dto: AssignEmployeesDto) {
    return this.employeeService.assignToObject(dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateDto) {
    return this.employeeService.update(id, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Patch('transfer/:id')
  async transfer(@Param('id') id: string, @Body() dto: TransferEmployeeDto) {
    return this.employeeService.transfer(id, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
    Roles.FOREMAN,
  )
  @Patch('unassign/:id')
  async unassignFromObject(@Param('id') id: string) {
    return this.employeeService.unassignFromObject(id);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
    Roles.FOREMAN,
  )
  @Post('add-skills/:id')
  async addSkills(@Param('id') employeeId: string, @Body() dto: AddSkillsDto) {
    return this.employeeService.addSkillsToEmployee(employeeId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
    Roles.FOREMAN,
  )
  @Patch('remove-skill/:id')
  async removeSkill(
    @Param('id') employeeId: string,
    @Body() dto: RemoveSkillsDto,
  ) {
    return this.employeeService.removeSkillFromEmployee(employeeId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Patch('archive/:id')
  async archiveEmployee(
    @Param('id') id: string,
    @Body() dto: ArchiveDto,
    @Authorized('id') userId: string,
  ) {
    return this.employeeService.archiveEmployee(id, dto, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Patch('restore/:id')
  async restoreEmployee(@Param('id') id: string) {
    return this.employeeService.restoreEmployee(id);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.employeeService.delete(id);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Post('upload-document/:id')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('id') employeeId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateEmployeeDocumentDto,
  ) {
    const uploadResult = await this.s3DocumentsService.uploadDocument(file, {
      folder: `employees_documents/${employeeId}`,
      filename: body.name,
    });
    console.log('tuk tuk');

    return this.employeeDocumentsService.create(employeeId, {
      name: body.name,
      expDate: body.expDate,
      docSrc: uploadResult.url,
    });
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Get('documents/:id')
  async getDocumentsById(@Param('id') employeeId: string) {
    return this.employeeDocumentsService.findAll(employeeId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Delete('remove-document/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeDocuement(@Param('id') documentId: string) {
    return this.employeeDocumentsService.remove(documentId);
  }
}
