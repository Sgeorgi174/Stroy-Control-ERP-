import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { ConfigService } from '@nestjs/config';

interface MaxApiResponse {
  message?: string; // Или более детальный тип сообщения, если нужно
  success?: boolean;
  error?: string;
  description?: string;
}

@Injectable()
export class MaxBotService {
  private readonly apiUrl = 'https://platform-api.max.ru/messages';
  private readonly token: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.token = this.configService.getOrThrow<string>('MAX_BOT_TOKEN');
  }

  /**
   * Прямая отправка сообщения по официальной документации Max
   */

  private async sendRawMessage(chatId: string | number, text: string) {
    try {
      const response = await fetch(`${this.apiUrl}?chat_id=${chatId}`, {
        method: 'POST',
        headers: {
          'Authorization': this.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
        }),
      });

      const result = (await response.json()) as MaxApiResponse;

      if (!response.ok) {
        console.error('Ошибка Max API:', result);
        throw new Error(result.message || 'Max API Error');
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('🔴 Ошибка отправки в Max:', errorMessage);
      throw new InternalServerErrorException(
        'Не удалось отправить сообщение через Max API',
      );
    }
  }

  public async sendOtp(dto: SendOtpDto) {
    const maxUser = await this.prismaService.maxUser.findUnique({
      where: { phone: dto.phone },
    });

    if (!maxUser) {
      throw new NotFoundException('Пользователь не найден в боте Max');
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 60 * 1000);

    await this.prismaService.verifacationCode.upsert({
      where: { userId: dto.userId },
      create: { code: otp, codeExp: otpExpires, userId: dto.userId },
      update: { code: otp, codeExp: otpExpires },
    });

    await this.sendRawMessage(maxUser.chatId, `Ваш проверочный код: ${otp}`);
    return true;
  }

  public async sendRequestTransferPhoto(phone: string) {
    const maxUser = await this.prismaService.maxUser.findUnique({
      where: { phone },
    });

    if (!maxUser) throw new NotFoundException('Пользователь не найден');

    const type = maxUser.photoRequestedTransferType;
    const text =
      type !== 'CLOTHES'
        ? `Пожалуйста, отправьте фото ${type === 'TOOL' ? 'инструмента' : 'устройства'}. ⏳`
        : `Пожалуйста, отправьте фото комплектов одежды или обуви. ⏳`;

    return this.sendRawMessage(maxUser.chatId, text);
  }

  public async sendBulkRequestNotifications(phones: string[], text: string) {
    const maxUsers = await this.prismaService.maxUser.findMany({
      where: { phone: { in: phones } },
    });

    const sendPromises = maxUsers.map((user) =>
      this.sendRawMessage(user.chatId, text).catch((err) => {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        console.error(`Ошибка рассылки для ${user.phone}:`, errorMessage);
      }),
    );

    await Promise.allSettled(sendPromises);
  }
}
