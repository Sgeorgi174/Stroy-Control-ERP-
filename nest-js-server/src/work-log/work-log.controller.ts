import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { WorkLogService } from './work-log.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from '@prisma/client';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { CreateWorkLogDto } from './dto/create-work-log.dto';

@Controller('work-log')
export class WorkLogController {
  constructor(private readonly workLogService: WorkLogService) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('create')
  create(@Authorized('id') userId: string, @Body() dto: CreateWorkLogDto) {
    return this.workLogService.create(userId, dto);
  }

  @Get('object/:objectId')
  getArchive(
    @Param('objectId') objectId: string,
    @Query('year') year: string,
    @Query('month') month: string, // месяц от 1 до 12
  ) {
    return this.workLogService.findByMonth(objectId, +year, +month);
  }

  @Get('object/:objectId/calendar-highlights')
  getCalendarHighlights(
    @Param('objectId') objectId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.workLogService.getActiveDates(objectId, +year, +month);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.workLogService.remove(id);
  }
}
