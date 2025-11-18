import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ShiftService } from './shift.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'generated/prisma';
import { CreateShiftDto } from './dto/createShift.dto';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { GetShiftsFilterDto } from './dto/getShiftFilter.dto';
import { UpdateShiftDto } from './dto/updateShift.dto';

@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

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
  async create(@Body() dto: CreateShiftDto, @Authorized('id') userId: string) {
    return this.shiftService.createShift(dto, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
    Roles.HR,
  )
  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('filter')
  async getShiftsWithFilters(@Query() query: GetShiftsFilterDto) {
    return this.shiftService.getShiftsWithFilters(query);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
    Roles.HR,
  )
  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('get-by-object/:id')
  async getShiftsByObject(@Param() objectId: string) {
    return this.shiftService.getShiftsByObject(objectId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
    Roles.HR,
  )
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateShiftDto) {
    return this.shiftService.updateShift(id, dto);
  }
}
