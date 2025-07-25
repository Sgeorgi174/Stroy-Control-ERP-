import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { Authorized } from './decorators/authorized.decorator';
import { Authorization } from './decorators/auth.decorator';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(@Req() req: Request, @Body() dto: RegisterDto) {
    return this.authService.register(req, dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  public async verifyOtp(@Req() req: Request, @Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(req, dto);
  }

  @Authorization()
  @Get('me')
  @HttpCode(HttpStatus.OK)
  public async getMe(@Authorized('id') userId: string) {
    return this.authService.getMe(userId);
  }

  @Authorization()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(req, res);
  }
}
