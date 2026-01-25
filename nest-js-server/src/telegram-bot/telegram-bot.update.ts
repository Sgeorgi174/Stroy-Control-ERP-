import { TelegramBotService } from './telegram-bot.service';
import { InjectBot, Start, Update, On, Ctx } from 'nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3FileService } from 'src/s3/s3-file.service';
import { Context, Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

@Update()
export class TelegramBotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly telegramBotService: TelegramBotService,
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3FileService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply(
      '📱 Нажмите на кнопку ниже, чтобы автоматически отправить свой номер.',
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: '📞 Отправить номер телефона',
                request_contact: true,
              },
            ],
          ],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      },
    );
  }

  @On('contact')
  async onContact(@Ctx() ctx: Context) {
    const message = ctx.message as Message.ContactMessage;
    const contact = message.contact;
    const chatId = String(ctx.chat?.id); // ✅ теперь всегда строка

    if (!contact?.phone_number || !chatId) {
      return await ctx.reply('Произошла ошибка. Попробуйте ещё раз ⚠️');
    }

    let phone = contact.phone_number.trim();

    // Нормализация формата телефона
    if (!phone.startsWith('+')) {
      phone = '+' + phone;
    }

    const user = await this.prismaService.user.findUnique({ where: { phone } });

    console.log(user);
    console.log(phone);

    if (!user) {
      await ctx.reply('У вас нет доступа к этому боту ⚠️');
      return;
    }

    await this.prismaService.telegramUser.upsert({
      where: { chatId },
      update: { phone },
      create: {
        chatId,
        phone,
      },
    });

    await ctx.reply(`Спасибо, ${user.firstName}! Ваш номер сохранён ✅`);
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context) {
    const chatId = String(ctx.chat?.id);
    const message = ctx.message as Message.PhotoMessage;

    const telegramUser = await this.prismaService.telegramUser.findUnique({
      where: { chatId },
    });

    if (!telegramUser) {
      await ctx.reply('У вас нет доступа к боту ⚠️');
      return;
    }

    if (!telegramUser.photoRequestedTransferId) {
      await ctx.reply('Нет активного запроса на отправку фото ⚠️');
      return;
    }

    const transferId = telegramUser.photoRequestedTransferId;
    const transferType = telegramUser.photoRequestedTransferType;

    const photoArray = message.photo;
    const largestPhoto = photoArray?.[photoArray.length - 1];

    if (!largestPhoto?.file_id) {
      await ctx.reply('Не удалось получить фото ❌');
      return;
    }

    // Получаем файл с Telegram
    const fileLink = await ctx.telegram.getFileLink(largestPhoto.file_id);
    const file = await fetch(fileLink.href);
    const buffer = await file.arrayBuffer();

    const filename = `${transferId}.jpg`;

    // Используем наш S3Service
    const { path } = await this.s3Service.uploadImage(
      {
        buffer: Buffer.from(buffer),
        originalname: filename,
        mimetype: 'image/jpeg',
        size: buffer.byteLength,
      } as Express.Multer.File,
      {
        folder: 'transfer_photo',
        filename: transferId,
      },
    );

    // path = "transfer_photo/<transferId>.jpg"

    // Обновляем запись в нужной таблице
    switch (transferType) {
      case 'TOOL':
        await this.prismaService.pendingTransfersTools.update({
          where: { id: transferId },
          data: { photoUrl: path },
        });
        break;
      case 'DEVICE':
        await this.prismaService.pendingTransfersDevices.update({
          where: { id: transferId },
          data: { photoUrl: path },
        });
        break;
      case 'CLOTHES':
        await this.prismaService.pendingTransfersClothes.update({
          where: { id: transferId },
          data: { photoUrl: path },
        });
        break;
      default:
        await ctx.reply('Неизвестный тип перемещения ❌');
        return;
    }

    // Сбрасываем запрос фото
    await this.prismaService.telegramUser.update({
      where: { chatId },
      data: { photoRequestedTransferId: null },
    });

    await ctx.reply('Фото получено, ожидайте его в приложении ✅');
  }
}
