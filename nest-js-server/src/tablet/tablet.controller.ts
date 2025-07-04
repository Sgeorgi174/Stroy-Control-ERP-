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
import { Roles } from 'generated/prisma';
import { GetTabletsQueryDto } from './dto/get-tablet-query.dto';

@Controller('tablets')
export class TabletController {
  constructor(private readonly tabletService: TabletService) {}

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTabletDto) {
    return this.tabletService.create(dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('filter')
  async getFiltered(@Query() query: GetTabletsQueryDto) {
    return this.tabletService.getFiltered(query);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('by-id/:id')
  getById(@Param('id') id: string) {
    return this.tabletService.getById(id);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateTabletDto) {
    return this.tabletService.update(id, dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Patch('status/:id')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTabletStatusDto,
    @Authorized('id') userId: string,
  ) {
    return this.tabletService.changeStatus(id, userId, dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Patch('transfer/:id')
  transfer(
    @Param('id') id: string,
    @Body() dto: TransferTabletDto,
    @Authorized('id') userId: string,
  ) {
    return this.tabletService.transfer(id, dto, userId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Patch('release/:id')
  release(@Param('id') id: string, @Authorized('id') userId: string) {
    return this.tabletService.release(id, userId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.tabletService.delete(id);
  }
}
