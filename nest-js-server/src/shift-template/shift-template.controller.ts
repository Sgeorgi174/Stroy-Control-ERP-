import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ShiftTemplateService } from './shift-template.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'generated/prisma';
import { CreateShiftTemplateDto } from './dto/createShiftTemplate.dto';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { UpdateShiftTemplateDto } from './dto/updateShiftTemplate.dto';

@Controller('shift-template')
export class ShiftTemplateController {
  constructor(private readonly shiftTemplateService: ShiftTemplateService) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateShiftTemplateDto,
    @Authorized('id') userId: string,
  ) {
    return this.shiftTemplateService.createShiftTemplate(dto, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('get-by-object/:id')
  async getShiftsByObject(@Param('id') objectId: string) {
    return this.shiftTemplateService.getShiftTemplatesByObject(objectId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateShiftTemplateDto) {
    return this.shiftTemplateService.updateShiftTemplate(id, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.shiftTemplateService.deleteShiftTemplate(id);
  }
}
