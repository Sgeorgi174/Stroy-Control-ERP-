import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ClothesService } from './clothes.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'generated/prisma';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { TransferDto } from './dto/transfer.dto';
import { ConfirmDto } from './dto/confirm.dto';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { AddDto } from './dto/add.dto';
import { WriteOffDto } from './dto/write-off.dto';
import { GiveClothingDto } from './dto/give-clothing.dto';

@Controller('clothes')
export class ClothesController {
  constructor(private readonly clothesService: ClothesService) {}

  @Authorization(Roles.OWNER)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateDto) {
    return this.clothesService.create(dto);
  }

  @Authorization(Roles.OWNER)
  @Get('all')
  async getAll() {
    return this.clothesService.getAll();
  }

  @Authorization(Roles.OWNER)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.clothesService.getById(id);
  }

  @Authorization(Roles.OWNER)
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateDto) {
    return this.clothesService.update(id, dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN, Roles.MASTER)
  @Patch('transfer/:id')
  async transfer(
    @Param('id') id: string,
    @Body() dto: TransferDto,
    @Authorized('id') userId: string,
  ) {
    return this.clothesService.transfer(id, dto, userId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN, Roles.MASTER)
  @Patch('confirm/:id')
  async confirmTransfer(@Param('id') id: string, @Body() dto: ConfirmDto) {
    return this.clothesService.confirmTransfer(id, dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN, Roles.MASTER)
  @Patch('add/:id')
  async addClothes(
    @Param('id') id: string,
    @Body() dto: AddDto,
    @Authorized('id') userId: string,
  ) {
    return this.clothesService.addClothes(id, dto, userId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN, Roles.MASTER)
  @Patch('write-off/:id')
  async writeOffClothes(
    @Param('id') id: string,
    @Body() dto: WriteOffDto,
    @Authorized('id') userId: string,
  ) {
    return this.clothesService.writeOffClothes(id, dto, userId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN, Roles.MASTER)
  @Patch('give/:id')
  async giveToEmployee(
    @Param('id') id: string,
    @Body() dto: GiveClothingDto,
    @Authorized('id') userId: string,
  ) {
    return this.clothesService.giveToEmployee(id, dto, userId);
  }

  @Authorization(Roles.OWNER)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.clothesService.delete(id);
  }
}
