import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'generated/prisma';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization(Roles.OWNER)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async getMyProfile(@Authorized('id') userId: string) {
    return this.userService.findById(userId);
  }
}
