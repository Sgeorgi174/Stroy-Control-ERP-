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
  Query,
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
import { GetClothesQueryDto } from './dto/get-clothes-query.dto';
import { RejectClothesTransferDto } from './dto/reject-transfer.dto';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';
import { UserService } from 'src/user/user.service';
import { RetransferClothesDto } from './dto/retransfer.dto';
import { CancelClothesTransferDto } from './dto/cancel-transfer.dto';
import { WriteOffClothesInTransferDto } from './dto/write-off-in-transit.dto';
import { AddSizeForClothingDto } from './dto/add-size-for-clothing.dto';
import { AddSizeForFootwearDto } from './dto/add-size-for-footwear.dto';
import { AddHeightForClothingDto } from './dto/add-height-for-clothing.dto';

@Controller('clothes')
export class ClothesController {
  constructor(
    private readonly clothesService: ClothesService,
    private readonly userService: UserService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateDto) {
    return this.clothesService.create(dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Post('create-size-clothing')
  @HttpCode(HttpStatus.CREATED)
  async addSizeForClothing(@Body() dto: AddSizeForClothingDto) {
    return this.clothesService.addSizeForClothing(dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Delete('remove-size-clothing/:id')
  async removeSizeForClothing(@Param('id') id: string) {
    return this.clothesService.removeSizeForClothing(id);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Post('create-size-footwear')
  @HttpCode(HttpStatus.CREATED)
  async addSizeForFootwear(@Body() dto: AddSizeForFootwearDto) {
    return this.clothesService.addSizeForFootwear(dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Delete('remove-size-footwear/:id')
  async removeSizeForFootwear(@Param('id') id: string) {
    return this.clothesService.removeSizeForFootwear(id);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Post('create-height-clothing')
  @HttpCode(HttpStatus.CREATED)
  async addHeightForFootwear(@Body() dto: AddHeightForClothingDto) {
    return this.clothesService.addHeightForClothing(dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Delete('remove-height-clothing/:id')
  async removeHeightForFootwear(@Param('id') id: string) {
    return this.clothesService.removeHeightForClothing(id);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('filter')
  async getFiltered(@Query() query: GetClothesQueryDto) {
    return this.clothesService.getFiltered(query);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.clothesService.getById(id);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
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
  async confirmTransfer(
    @Param('id') id: string,
    @Body() dto: ConfirmDto,
    @Authorized('id') userId: string,
  ) {
    return this.clothesService.confirmTransfer(id, dto, userId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Patch('reject/:id')
  async rejectTransfer(
    @Param('id') id: string,
    @Body() dto: RejectClothesTransferDto,
  ) {
    return this.clothesService.rejectTransfer(id, dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Post('request-photo-transfer/:id')
  async rejectToolTransfer(
    @Param('id') transferId: string,
    @Authorized('phone') phone: string,
  ) {
    await this.userService.setPhotoRequestTransferId(
      phone,
      transferId,
      'CLOTHES',
    );
    await this.telegramBotService.sendRequestTransferPhoto(phone);
    return { success: true };
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Post('retransfer/:id')
  async reTransfer(
    @Param('id') transferId: string,
    @Body() dto: RetransferClothesDto,
    @Authorized('id') userId: string,
  ) {
    console.log(transferId, dto, userId);

    return this.clothesService.reTransfer(transferId, dto, userId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Post('transfer-return/:id')
  async returnToSource(
    @Param('id') transferId: string,
    @Authorized('id') userId: string,
  ) {
    return this.clothesService.returnToSource(transferId, userId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Post('transfer-cancel/:id')
  async cancelTransfer(
    @Param('id') transferId: string,
    @Body() dto: CancelClothesTransferDto,
    @Authorized('id') userId: string,
  ) {
    return this.clothesService.cancelTransfer(transferId, userId, dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Post('transfer-write-off/:id')
  async writeOffInTransfer(
    @Param('id') transferId: string,
    @Body() dto: WriteOffClothesInTransferDto,
    @Authorized('id') userId: string,
  ) {
    return this.clothesService.writeOffInTransfer(transferId, userId, dto);
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

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.clothesService.delete(id);
  }
}
