import { Controller, Delete, Get, Param, Post, Body } from '@nestjs/common';
import { TabletHistoryService } from './tablet-history.service';
import { CreateDto } from './dto/create.dto';

@Controller('tablet-history')
export class TabletHistoryController {
  constructor(private readonly service: TabletHistoryService) {}

  @Post('create')
  create(@Body() dto: CreateDto, userId: string) {
    return this.service.create(dto, userId);
  }

  @Get('by-tablet/:tabletId')
  getByTablet(@Param('tabletId') tabletId: string) {
    return this.service.getByTabletId(tabletId);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
