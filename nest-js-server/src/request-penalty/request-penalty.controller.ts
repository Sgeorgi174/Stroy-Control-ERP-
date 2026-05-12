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
import {
  CreateEmployeePenaltyDto,
  CreatePenaltyCommentDto,
  GetPenaltyFilterDto,
  UpdateEmployeePenaltyDto,
} from './dto/request-penalty.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { EmployeePenaltyService } from './request-penalty.service';

@Controller('penalties')
export class EmployeePenaltyController {
  constructor(private readonly penaltyService: EmployeePenaltyService) {}

  // --- УПРАВЛЕНИЕ ЗАЯВКАМИ ---

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
    @Body() dto: CreateEmployeePenaltyDto,
  ) {
    return this.penaltyService.create(userId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.ACCOUNTANT,
  )
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateEmployeePenaltyDto) {
    return this.penaltyService.update(id, dto);
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
    return this.penaltyService.approve(id, userId);
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
    return this.penaltyService.process(id, userId);
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
    @Body('reason') reason?: string, // Принимаем причину отклонения
  ) {
    return this.penaltyService.reject(id, userId, reason);
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
    return this.penaltyService.cancel(id, userId);
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
  async findAll(@Query() filters: GetPenaltyFilterDto) {
    return this.penaltyService.findAll(filters);
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
    return this.penaltyService.findOne(id);
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
    return this.penaltyService.getEmployeePenaltyStats(employeeId);
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
    @Param('id') penaltyId: string, // Это UUID из URL
    @Authorized('id') userId: string,
    @Body() dto: CreatePenaltyCommentDto, // Здесь теперь только { text: string }
  ) {
    // Передаем userId, dto (текст) и penaltyId (из URL) как три разных аргумента
    return this.penaltyService.addComment(userId, dto, penaltyId);
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
    return this.penaltyService.deleteComment(commentId, userId, role);
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
    return this.penaltyService.findComments(id);
  }
}
