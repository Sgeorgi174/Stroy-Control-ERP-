import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { Context, Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';

@Injectable()
export class TelegramBotService {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  public async sendOtp(dto: SendOtpDto) {
    const telegramUser = await this.prismaService.telegramUser.findUnique({
      where: { phone: dto.phone },
    });

    if (!telegramUser) {
      throw new NotFoundException('Вы не зарегистрированы в боте!');
    }

    const chatId: number = telegramUser.chatId;
    const otp = this.generateOtp();

    try {
      await this.bot.telegram.sendMessage(
        chatId,
        `Ваш одноразовый код: ${otp}`,
      );
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Не удалось отправить сообщение в Telegram',
      );
    }
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
