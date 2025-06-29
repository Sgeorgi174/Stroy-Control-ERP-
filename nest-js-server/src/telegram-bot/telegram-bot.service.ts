import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  private generateOtp(): number {
    return Number(Math.floor(100000 + Math.random() * 900000).toString());
  }

  public async sendOtp(dto: SendOtpDto) {
    // const telegramUser = await this.prismaService.telegramUser.findUnique({
    //   where: { phone: dto.phone },
    // });

    // if (!telegramUser) {
    //   throw new NotFoundException('Вы не зарегистрированы в боте!');
    // }

    // const chatId: number = telegramUser.chatId;
    // const otp = this.generateOtp();
    const chatId: number = 836996470;
    const otp = 666666;
    const otpExpires = new Date(Date.now() + 60 * 1000);

    await this.prismaService.verifacationCode.upsert({
      where: { userId: dto.userId },
      create: {
        code: otp,
        codeExp: otpExpires,
        userId: dto.userId,
      },
      update: {
        code: otp,
        codeExp: otpExpires,
      },
    });

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
}
