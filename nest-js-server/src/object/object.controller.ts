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
} from '@nestjs/common';
import { ObjectService } from './object.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'generated/prisma';
import { Authorized } from 'src/auth/decorators/authorized.decorator';

@Controller('objects')
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Authorization(Roles.OWNER)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateDto) {
    return this.objectService.create(dto);
  }

  @Authorization(Roles.OWNER)
  @Get('all')
  async getAll() {
    return this.objectService.getAll();
  }

  @Authorization(Roles.OWNER)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.objectService.getById(id);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('user')
  async getByUserId(@Authorized('id') userId: string) {
    return this.objectService.getByUserId(userId);
  }

  @Authorization(Roles.OWNER)
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateDto) {
    return this.objectService.update(id, dto);
  }

  @Authorization(Roles.OWNER)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.objectService.delete(id);
  }
}
