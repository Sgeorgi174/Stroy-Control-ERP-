import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'generated/prisma';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { TransferDto } from './dto/transfer.dto';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { UpdateStatusDto } from './dto/update-status.dto';
import { GetToolsQueryDto } from 'src/tool/dto/get-tools-query.dto';
import { RejectDeviceTransferDto } from './dto/reject-transfer.dto';
import { UserService } from 'src/user/user.service';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';

@Controller('devices')
export class DeviceController {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly userService: UserService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Post('create')
  create(@Body() dto: CreateDto) {
    return this.deviceService.create(dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('all')
  getAll() {
    return this.deviceService.getAll();
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('filter')
  async getFiltered(@Query() query: GetToolsQueryDto) {
    return this.deviceService.getFiltered(query);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('by-id/:id')
  getById(@Param('id') id: string) {
    return this.deviceService.getById(id);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateDto) {
    return this.deviceService.update(id, dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Patch('transfer/:id')
  transfer(
    @Param('id') id: string,
    @Body() dto: TransferDto,
    @Authorized('id') userId: string,
  ) {
    return this.deviceService.transfer(id, dto, userId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Patch('status/:id')
  changeStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @Authorized('id') userId: string,
  ) {
    return this.deviceService.changeStatus(id, userId, dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Patch('confirm/:id')
  async confirmTransfer(
    @Param('id') id: string,
    @Authorized('id') userId: string,
  ) {
    return this.deviceService.confirmTransfer(id, userId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Patch('reject/:id')
  async rejectTransfer(
    @Param('id') id: string,
    @Body() dto: RejectDeviceTransferDto,
    @Authorized('id') userId: string,
  ) {
    return this.deviceService.rejectTransfer(id, userId, dto);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.deviceService.delete(id);
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
      'DEVICE',
    );
    await this.telegramBotService.sendRequestTransferPhoto(phone);
    return { success: true };
  }
}
