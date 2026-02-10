import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateSentItemDto } from './dto/create-sent-item.dto';
import { UpdateSentItemDto } from './dto/update-sent-item.dto';
import { SentItemsService } from './sent-item.service';
import { ChangeSentItemQuantityDto } from './dto/change-sent-quantity.dto';

@Controller('sent-items')
export class SentItemsController {
  constructor(private readonly sentItemsService: SentItemsService) {}

  @Post('create')
  create(@Body() dto: CreateSentItemDto) {
    return this.sentItemsService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.sentItemsService.findAll();
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateSentItemDto) {
    return this.sentItemsService.update(id, dto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.sentItemsService.remove(id);
  }

  // ➕ пополнение
  @Post('add/:id')
  addQuantity(@Param('id') id: string, @Body() dto: ChangeSentItemQuantityDto) {
    return this.sentItemsService.addQuantity(id, dto);
  }

  // ➖ списание
  @Post('remove/:id')
  removeQuantity(
    @Param('id') id: string,
    @Body() dto: ChangeSentItemQuantityDto,
  ) {
    return this.sentItemsService.removeQuantity(id, dto);
  }

  @Get('history/:id')
  getHistory(@Param('id') id: string) {
    return this.sentItemsService.getHistory(id);
  }
}
