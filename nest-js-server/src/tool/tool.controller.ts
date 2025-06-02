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
  Patch,
} from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'generated/prisma';
import { Authorized } from 'src/auth/decorators/authorized.decorator';

@Controller('tools')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateDto) {
    return this.toolService.create(dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('all')
  async getAll() {
    return this.toolService.getAll();
  }

  @Authorization(Roles.OWNER)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.toolService.getById(id);
  }

  @Authorization(Roles.OWNER)
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateDto) {
    return this.toolService.update(id, dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Patch('transfer/:id')
  async transfer(
    @Param('id') id: string,
    @Body() object: { objectId: string },
    @Authorized('id') userId: string,
  ) {
    return this.toolService.transfer(id, object.objectId, userId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Patch('confirm/:id')
  async confirmTransfer(@Param('id') id: string) {
    return this.toolService.confirmTransfer(id);
  }

  @Authorization(Roles.OWNER)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.toolService.delete(id);
  }
}
