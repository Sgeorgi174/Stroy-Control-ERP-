import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdditionalStorageService } from './additional-storage.service';
import { CreateAdditionalStorageDto } from './dto/create-additional-storage.dto';
import { UpdateAdditionalStorageDto } from './dto/update-addtitonal-storage.dto';

@Controller('additional-storage')
export class AdditionalStorageController {
  constructor(
    private readonly additionalStorageService: AdditionalStorageService,
  ) {}

  @Post('create')
  create(@Body() dto: CreateAdditionalStorageDto) {
    return this.additionalStorageService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.additionalStorageService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdditionalStorageDto) {
    return this.additionalStorageService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.additionalStorageService.remove(id);
  }
}
