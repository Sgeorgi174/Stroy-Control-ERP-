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
  Query,
  Patch,
} from '@nestjs/common';
import { ObjectService } from './object.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'generated/prisma';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { GetObjectQueryDto } from './dto/get-object-query.dto';
import { ChangeForemanDto } from './dto/changeForeman.dto';

@Controller('objects')
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Authorization(Roles.OWNER)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateDto) {
    return this.objectService.create(dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('filter')
  async getFiltered(@Query() query: GetObjectQueryDto) {
    return this.objectService.getFiltered(query);
  }

  @Authorization(Roles.OWNER)
  @Get('close-object/:id')
  async getByIdToClose(@Param('id') id: string) {
    return this.objectService.getByIdToClose(id);
  }

  @Authorization(Roles.OWNER)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.objectService.getByIdToClose(id);
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
  @Patch('change-foreman/:id')
  async changeForeman(@Param('id') id: string, @Body() dto: ChangeForemanDto) {
    return this.objectService.changeForeman(id, dto);
  }

  @Authorization(Roles.OWNER)
  @Patch('remove-foreman/:id')
  async removeForeman(@Param('id') id: string) {
    return this.objectService.removeForeman(id);
  }

  @Authorization(Roles.OWNER)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.objectService.delete(id);
  }
}
