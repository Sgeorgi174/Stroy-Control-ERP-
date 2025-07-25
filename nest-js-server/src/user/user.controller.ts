import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'generated/prisma';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { QueryTransfersFilterDto } from './dto/query-transfer-filter.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization(Roles.FOREMAN)
  @Get('notification')
  async getNotifications(@Authorized('id') userId: string) {
    return this.userService.getNotifications(userId);
  }

  @Authorization(Roles.FOREMAN)
  @Get('notification-return')
  async getReturns(@Authorized('id') userId: string) {
    return this.userService.getReturns(userId);
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
  async getAllTransfers(@Query() filters: QueryTransfersFilterDto) {
    return this.userService.getAllTransfers(filters);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('transfer-tool-photo/:id')
  async getToolTransferPhoto(@Param('id') transferId: string) {
    return this.userService.getToolTransferPhoto(transferId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('transfer-device-photo/:id')
  async getDeviceTransferPhoto(@Param('id') transferId: string) {
    return this.userService.getDeviceTransferPhoto(transferId);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('transfer-clothes-photo/:id')
  async getClothesTransferPhoto(@Param('id') transferId: string) {
    return this.userService.getClothesTransferPhoto(transferId);
  }
}
