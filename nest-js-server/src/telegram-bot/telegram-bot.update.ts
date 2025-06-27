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

    const phone = contact.phone_number;

    // ✅ Сохраняем или обновляем в БД
    await this.prismaService.telegramUser.upsert({
      where: { chatId },
      update: { phone },
      create: {
        chatId,
        phone,
      },
    });

    await ctx.reply('Спасибо! Ваш номер сохранён ✅');
  }
}
