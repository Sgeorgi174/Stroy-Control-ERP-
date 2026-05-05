import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { WorkLogService } from './work-log.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from '@prisma/client';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateWorkLogDto } from './dto/update-work-log.dto';

@Controller('work-log')
export class WorkLogController {
  constructor(private readonly workLogService: WorkLogService) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Post('create')
  @UseInterceptors(FilesInterceptor('photos', 3))
  create(
    @Authorized('id') userId: string,
    @Body() dto: CreateWorkLogDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.workLogService.create(userId, dto, files);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('object/:objectId')
  getArchive(
    @Param('objectId') objectId: string,
    @Query('year') year: string,
    @Query('month') month: string, // месяц от 1 до 12
  ) {
    return this.workLogService.findByMonth(objectId, +year, +month);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('object/:objectId/calendar-highlights')
  getCalendarHighlights(
    @Param('objectId') objectId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.workLogService.getActiveDates(objectId, +year, +month);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.workLogService.remove(id);
  }

  @Authorization(Roles.MASTER, Roles.OWNER, Roles.ADMIN, Roles.FOREMAN)
  @Patch('update/:id')
  @UseInterceptors(FilesInterceptor('photos', 3))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkLogDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.workLogService.update(id, dto, files);
  }
}
