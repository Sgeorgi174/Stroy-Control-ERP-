import { MaxContext, MaxOn, MaxStarted, MaxUpdate } from 'nestjs-max';
import { type Context } from 'max-io';
import type { MessageCreatedUpdate } from 'max-io/lib/core/network/api';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3FileService } from 'src/s3/s3-file.service';

@MaxUpdate()
export class BotUpdate {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3FileService,
  ) {}
  @MaxStarted()
  async onStarted(@MaxContext() ctx: Context) {
    // Ваша исправленная клавиатура
    await ctx.reply(
      '📱 Нажмите на кнопку ниже, чтобы отправить свой номер телефона.',
      {
        attachments: [
          {
            type: 'inline_keyboard',
            payload: {
              buttons: [
                [
                  {
                    type: 'request_contact',
                    text: '📱 Отправить номер',
                  },
                ],
              ],
            },
          },
        ],
      },
    );
  }

  // Заменили 'message' на 'message_created'
  @MaxOn('message_created')
  async onMessageCreated(@MaxContext() ctx: Context<MessageCreatedUpdate>) {
    const chatId = String(ctx.chatId);
    const isContact = ctx.update.message.body.attachments?.find(
      (att) => att.type === 'contact',
    );
    const isImage = ctx.update.message.body.attachments?.find(
      (att) => att.type === 'image',
    );

    if (isContact) {
      let phone = ctx.contactInfo?.tel;
      const fullName = ctx.contactInfo?.fullName;

      // 1. Нормализация (как было в ТГ сервисе)
      if (phone && !phone.startsWith('+')) {
        phone = '+' + phone;
      }
      // 2. Проверка прав доступа в вашей основной таблице User
      const user = await this.prismaService.user.findUnique({
        where: { phone },
      });

      if (!user) {
        await ctx.reply('У вас нет доступа к этому боту ⚠️');
        return;
      }

      if (!phone) {
        await ctx.reply('Невозможно сохранить ваш номер телефона ⚠️');
        return;
      }

      await this.prismaService.maxUser.upsert({
        where: { chatId },
        update: { phone },
        create: {
          chatId,
          phone,
        },
      });

      await ctx.reply(`Спасибо, ${fullName}! Ваш номер сохранён ✅`);
    }

    if (isImage) {
      const chatId = String(ctx.chatId);

      // 1. Проверяем, есть ли пользователь в нашей базе Max и ждем ли мы от него фото
      const maxUser = await this.prismaService.maxUser.findUnique({
        where: { chatId },
      });

      if (!maxUser || !maxUser.photoRequestedTransferId) {
        await ctx.reply('Нет активного запроса на отправку фото ⚠️');
        return;
      }

      const {
        photoRequestedTransferId: transferId,
        photoRequestedTransferType: transferType,
      } = maxUser;
      const fileUrl = isImage.payload?.url;

      if (!fileUrl) {
        await ctx.reply('Не удалось получить ссылку на фото ❌');
        return;
      }

      try {
        // 2. Скачиваем файл по прямой ссылке
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const filename = `${transferId}.jpg`;

        // 3. Загружаем в S3 (используем твой S3FileService)
        const { path } = await this.s3Service.uploadImage(
          {
            buffer,
            originalname: filename,
            mimetype: 'image/jpeg',
            size: buffer.byteLength,
          } as Express.Multer.File,
          {
            folder: 'transfer_photo',
            filename: transferId,
          },
        );

        // 4. Обновляем запись в нужной таблице в зависимости от типа (TOOL, DEVICE, CLOTHES)
        const updatePayload = {
          where: { id: transferId },
          data: { photoUrl: path },
        };

        switch (transferType) {
          case 'TOOL':
            await this.prismaService.pendingTransfersTools.update(
              updatePayload,
            );
            break;
          case 'DEVICE':
            await this.prismaService.pendingTransfersDevices.update(
              updatePayload,
            );
            break;
          case 'CLOTHES':
            await this.prismaService.pendingTransfersClothes.update(
              updatePayload,
            );
            break;
        }

        // 5. Сбрасываем запрос фото в профиле пользователя
        await this.prismaService.maxUser.update({
          where: { chatId },
          data: { photoRequestedTransferId: null },
        });

        await ctx.reply('Фото получено и сохранено в системе ✅');
        console.log(`✅ Фото загружено для ${transferType}: ${transferId}`);
      } catch (error) {
        console.error('Ошибка при обработке фото:', error);
        await ctx.reply('Произошла ошибка при сохранении фото ❌');
      }
    }
  }
}
