import { Body, Controller, Post } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { SendOtpDto } from './dto/send-otp.dto';

@Controller('telegram')
export class TelegramBotController {
  constructor(private readonly telegramBotService: TelegramBotService) {}

  @Post('send')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.telegramBotService.sendOtp(dto);
  }
}
