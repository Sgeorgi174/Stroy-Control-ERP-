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
}
