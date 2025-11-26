import { Controller, Delete, Get, Param, Post, Body } from '@nestjs/common';
import { TabletHistoryService } from './tablet-history.service';
import { CreateDto } from './dto/create.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from '@prisma/client';

@Controller('tablet-history')
export class TabletHistoryController {
  constructor(private readonly service: TabletHistoryService) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('create')
  create(@Body() dto: CreateDto, userId: string) {
    return this.service.create(dto, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Get('by-tablet/:tabletId')
  getByTablet(@Param('tabletId') tabletId: string) {
    return this.service.getByTabletId(tabletId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
