import { TelegramBotService } from './telegram-bot.service';
import { InjectBot, Start, Update, On, Ctx } from 'nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

@Update()
export class TelegramBotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly telegramBotService: TelegramBotService,
    private readonly prismaService: PrismaService,
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
    const chatId = Number(ctx.chat?.id); // ID чата, привязанный к пользователю

    if (!contact?.phone_number || !chatId) {
      return await ctx.reply('Произошла ошибка. Попробуйте ещё раз.');
    }

    let phone = contact.phone_number;

    // Нормализация: если номер не начинается с '+', добавляем его
    if (!phone.startsWith('+')) {
      phone = '+' + phone;
    }

    const user = await this.prismaService.user.findUnique({ where: { phone } });

    if (!user) {
      await ctx.reply('У вас нет доступа к этому боту ⚠️');
    } else {
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
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context) {
    const chatId = Number(ctx.chat?.id);
    const message = ctx.message as Message.PhotoMessage;

    const telegramUser = await this.prismaService.telegramUser.findUnique({
      where: { chatId },
    });

    if (!telegramUser) {
      await ctx.reply('У вас нет дотсупа к боту ⚠️');
      return;
    }

    if (!telegramUser.photoRequestedTransferId) {
      await ctx.reply('Нет активного запроса на отправку фото.');
      return;
    }

    const transferId = telegramUser.photoRequestedTransferId;
    const transferType = telegramUser.photoRequestedTransferType;

    const photoArray = message.photo;
    const largestPhoto = photoArray?.[photoArray.length - 1];

    if (!largestPhoto?.file_id) {
      await ctx.reply('Не удалось получить фото.');
      return;
    }

    const fileLink = await ctx.telegram.getFileLink(largestPhoto.file_id);

    const file = await fetch(fileLink.href);
    const buffer = await file.arrayBuffer();

    const filename = `${telegramUser.photoRequestedTransferId}.jpg`;
    const fs = await import('fs/promises');
    await fs.writeFile(`uploads/photos/${filename}`, Buffer.from(buffer));

    const url = `/uploads/photos/${filename}`;

    // Обновляем запись

    switch (transferType) {
      case 'TOOL':
        await this.prismaService.pendingTransfersTools.update({
          where: { id: transferId },
          data: { photoUrl: url },
        });
        break;
      case 'DEVICE':
        await this.prismaService.pendingTransfersDevices.update({
          where: { id: transferId },
          data: { photoUrl: url },
        });
        break;
      case 'CLOTHES':
        await this.prismaService.pendingTransfersClothes.update({
          where: { id: transferId },
          data: { photoUrl: url },
        });
        break;
      default:
        await ctx.reply('Неизвестный тип перемещения.');
        return;
    }

    await this.prismaService.telegramUser.update({
      where: { chatId },
      data: { photoRequestedTransferId: null },
    });

    await ctx.reply('Фото получено, статус обновлён.');
  }
}
