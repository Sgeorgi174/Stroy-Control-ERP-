import { Controller, Get } from '@nestjs/common';
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

  @Authorization(Roles.OWNER)
  @Get('foremen')
  async getFreeForemen() {
    return this.userService.getFreeForemen();
  }
}
