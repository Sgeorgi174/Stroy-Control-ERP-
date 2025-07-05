import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'generated/prisma';
import { Authorized } from 'src/auth/decorators/authorized.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization(Roles.FOREMAN)
  @Get('notification')
  async getFiltered(@Authorized('id') userId: string) {
    return this.userService.getNotifications(userId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('foremen')
  async getFreeForemen() {
    return this.userService.getFreeForemen();
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('get-status-object')
  async getStatusObject(@Authorized('id') userId: string) {
    return this.userService.getStatusObject(userId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('transfers')
  async getAllTransfers() {
    return this.userService.getAllTransfers();
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('get-transfer-photo/:id')
  async getToolTransferPhoto(@Param('id') transferId: string) {
    return this.userService.getToolTransferPhoto(transferId);
  }

  // 📸 Установить запрос фото по transferId
  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Patch('photo-request/:id')
  async requestTransferPhoto(
    @Param('id') transferId: string,
    @Authorized('phone') phone: string,
  ) {
    return this.userService.setPhotoRequestTransferId(phone, transferId);
  }

  // ❌ Очистить запрос фото
  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Patch('photo-request/clear')
  async clearTransferPhotoRequest(@Authorized('phone') phone: string) {
    return this.userService.clearPhotoRequestTransferId(phone);
  }
}
