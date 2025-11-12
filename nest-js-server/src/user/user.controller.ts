import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'generated/prisma';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { QueryTransfersFilterDto } from './dto/query-transfer-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Post('create')
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Post('update/:id')
  async updateUser(@Param('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(userId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Delete('delete/:id')
  async deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Authorization()
  @Get('get-all')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('notification')
  async getNotifications(@Authorized('id') userId: string) {
    return this.userService.getNotifications(userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('notification-return')
  async getReturns(@Authorized('id') userId: string) {
    return this.userService.getReturns(userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('foremen')
  async getFreeForemen() {
    return this.userService.getFreeForemen();
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('get-status-object')
  async getStatusObject(@Authorized('id') userId: string) {
    return this.userService.getStatusObject(userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('transfers')
  async getAllTransfers(@Query() filters: QueryTransfersFilterDto) {
    return this.userService.getAllTransfers(filters);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('transfer-tool-photo/:id')
  async getToolTransferPhoto(@Param('id') transferId: string) {
    return this.userService.getToolTransferPhoto(transferId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('transfer-device-photo/:id')
  async getDeviceTransferPhoto(@Param('id') transferId: string) {
    return this.userService.getDeviceTransferPhoto(transferId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('transfer-clothes-photo/:id')
  async getClothesTransferPhoto(@Param('id') transferId: string) {
    return this.userService.getClothesTransferPhoto(transferId);
  }
}
