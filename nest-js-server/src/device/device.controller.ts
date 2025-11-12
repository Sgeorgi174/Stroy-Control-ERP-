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
import { WriteOffDeviceInTransferDto } from './dto/write-off-in-transit.dto';
import { CancelDeviceTransferDto } from './dto/cancel-transfer.dto';
import { RetransferDeviceDto } from './dto/retransfer.dto';

@Controller('devices')
export class DeviceController {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly userService: UserService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('create')
  create(@Body() dto: CreateDto, @Authorized('role') userRole: Roles) {
    return this.deviceService.create(dto, userRole);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('all')
  getAll() {
    return this.deviceService.getAll();
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
  async getFiltered(@Query() query: GetToolsQueryDto) {
    return this.deviceService.getFiltered(query);
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
    return this.deviceService.getById(id);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateDto) {
    return this.deviceService.update(id, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Patch('transfer/:id')
  transfer(
    @Param('id') id: string,
    @Body() dto: TransferDto,
    @Authorized('id') userId: string,
  ) {
    return this.deviceService.transfer(id, dto, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Patch('status/:id')
  changeStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @Authorized('id') userId: string,
  ) {
    return this.deviceService.changeStatus(id, userId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Patch('confirm/:id')
  async confirmTransfer(
    @Param('id') id: string,
    @Authorized('id') userId: string,
  ) {
    return this.deviceService.confirmTransfer(id, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Patch('reject/:id')
  async rejectTransfer(
    @Param('id') id: string,
    @Body() dto: RejectDeviceTransferDto,
    @Authorized('id') userId: string,
  ) {
    return this.deviceService.rejectTransfer(id, userId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.deviceService.delete(id);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
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

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('retransfer/:id')
  async reTransfer(
    @Param('id') transferId: string,
    @Body() dto: RetransferDeviceDto,
    @Authorized('id') userId: string,
  ) {
    console.log(transferId, dto, userId);

    return this.deviceService.reTransfer(transferId, dto, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('transfer-return/:id')
  async returnToSource(
    @Param('id') transferId: string,
    @Authorized('id') userId: string,
  ) {
    return this.deviceService.returnToSource(transferId, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('transfer-cancel/:id')
  async cancelTransfer(
    @Param('id') transferId: string,
    @Body() dto: CancelDeviceTransferDto,
    @Authorized('id') userId: string,
  ) {
    return this.deviceService.cancelTransfer(transferId, userId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('transfer-write-off/:id')
  async writeOffInTransfer(
    @Param('id') transferId: string,
    @Body() dto: WriteOffDeviceInTransferDto,
    @Authorized('id') userId: string,
  ) {
    return this.deviceService.writeOffInTransfer(transferId, userId, dto);
  }
}
