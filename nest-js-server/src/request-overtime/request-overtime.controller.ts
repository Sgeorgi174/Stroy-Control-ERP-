import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  Patch,
  Put,
  Delete,
} from '@nestjs/common';
import { Roles } from '@prisma/client';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { RequestOvertimeService } from './request-overtime.service';
import {
  CreateEmployeeOvertimeDto,
  CreateOvertimeCommentDto,
  GetOvertimeFilterDto,
  UpdateEmployeeOvertimeDto,
} from './dto/request-overtime.dto';

@Controller('overtimes')
export class RequestOvertimeController {
  constructor(private readonly overtimeService: RequestOvertimeService) {}

  // --- УПРАВЛЕНИЕ ЗАЯВКАМИ НА ДОП. ЧАСЫ ---

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.ACCOUNTANT,
  )
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Authorized('id') userId: string,
    @Body() dto: CreateEmployeeOvertimeDto,
  ) {
    return this.overtimeService.create(userId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.ACCOUNTANT,
  )
  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeOvertimeDto,
  ) {
    return this.overtimeService.update(id, dto);
  }

  @Authorization(
    Roles.OWNER,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.ACCOUNTANT,
    Roles.MASTER,
  )
  @Patch('approve/:id')
  async approve(@Param('id') id: string, @Authorized('id') userId: string) {
    return this.overtimeService.approve(id, userId);
  }

  @Authorization(
    Roles.OWNER,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.ACCOUNTANT,
    Roles.MASTER,
  )
  @Patch('process/:id')
  async process(@Param('id') id: string, @Authorized('id') userId: string) {
    return this.overtimeService.process(id, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ADMIN,
    Roles.ACCOUNTANT,
    Roles.ASSISTANT_MANAGER,
  )
  @Patch('reject/:id')
  async reject(
    @Param('id') id: string,
    @Authorized('id') userId: string,
    @Body('reason') reason?: string,
  ) {
    return this.overtimeService.reject(id, userId, reason);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.ACCOUNTANT,
  )
  @Patch('cancel/:id')
  async cancel(@Param('id') id: string, @Authorized('id') userId: string) {
    return this.overtimeService.cancel(id, userId);
  }

  // --- ПОЛУЧЕНИЕ ДАННЫХ ---

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Get('filter')
  async findAll(@Query() filters: GetOvertimeFilterDto) {
    return this.overtimeService.findAll(filters);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Get('by-id/:id')
  async findOne(@Param('id') id: string) {
    return this.overtimeService.findOne(id);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Get('stats/:employeeId')
  async getStats(@Param('employeeId') employeeId: string) {
    return this.overtimeService.getEmployeeOvertimeStats(employeeId);
  }

  // --- КОММЕНТАРИИ ---

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ADMIN,
    Roles.ACCOUNTANT,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Post(':id/comments')
  async addComment(
    @Param('id') overtimeId: string,
    @Authorized('id') userId: string,
    @Body() dto: CreateOvertimeCommentDto,
  ) {
    return this.overtimeService.addComment(userId, dto, overtimeId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ADMIN,
    Roles.ACCOUNTANT,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Get(':id/comments')
  async getComments(@Param('id') id: string) {
    return this.overtimeService.findComments(id);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ADMIN,
    Roles.ACCOUNTANT,
    Roles.ASSISTANT_MANAGER,
    Roles.HR,
  )
  @Delete('comments/:commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @Authorized('id') userId: string,
    @Authorized('role') role: string,
  ) {
    return this.overtimeService.deleteComment(commentId, userId, role);
  }
}
