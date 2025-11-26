import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TabletService } from './tablet.service';
import { CreateTabletDto } from './dto/create.dto';
import { UpdateTabletDto } from './dto/update.dto';
import { TransferTabletDto } from './dto/transfer.dto';
import { UpdateTabletStatusDto } from './dto/update-status.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { GetTabletsQueryDto } from './dto/get-tablet-query.dto';
import { Roles } from '@prisma/client';

@Controller('tablets')
export class TabletController {
  constructor(private readonly tabletService: TabletService) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTabletDto) {
    return this.tabletService.create(dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('filter')
  async getFiltered(@Query() query: GetTabletsQueryDto) {
    return this.tabletService.getFiltered(query);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('by-id/:id')
  getById(@Param('id') id: string) {
    return this.tabletService.getById(id);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateTabletDto) {
    return this.tabletService.update(id, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Patch('status/:id')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTabletStatusDto,
    @Authorized('id') userId: string,
  ) {
    return this.tabletService.changeStatus(id, userId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Patch('transfer/:id')
  transfer(
    @Param('id') id: string,
    @Body() dto: TransferTabletDto,
    @Authorized('id') userId: string,
  ) {
    return this.tabletService.transfer(id, dto, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Patch('release/:id')
  release(@Param('id') id: string, @Authorized('id') userId: string) {
    return this.tabletService.release(id, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.tabletService.delete(id);
  }
}
