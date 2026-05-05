import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ToolBrandService } from './tool-brand.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from '@prisma/client';
import { CreateBrandDto } from './dto/tool-brand.dto';

@Controller('tool-brands')
export class ToolBrandController {
  constructor(private readonly toolBrandService: ToolBrandService) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get()
  async findAll() {
    return this.toolBrandService.findAll();
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.toolBrandService.findOne(id);
  }

  @Authorization(
    Roles.OWNER,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.ACCOUNTANT,
    Roles.MASTER,
  )
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBrandDto) {
    return this.toolBrandService.create(dto);
  }

  @Authorization(
    Roles.OWNER,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.ACCOUNTANT,
    Roles.MASTER,
  )
  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.toolBrandService.remove(id);
  }
}
