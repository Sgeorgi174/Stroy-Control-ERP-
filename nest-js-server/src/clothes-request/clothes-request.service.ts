import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClothesRequestDto } from './dto/create-clothes-request.dto';
import { UpdateClothesRequestDto } from './dto/update-clothes-request.dto';
import { ClothesActions, RequestStatus, Roles, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
// import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';
import { MaxBotService } from 'src/max-bot/max-bot.service';

@Injectable()
export class ClothesRequestService {
  constructor(
    private readonly prisma: PrismaService,
    // private telegram: TelegramBotService,
    private maxBot: MaxBotService,
  ) {}

  async findOne(id: string, user: User) {
    const request = await this.prisma.clothesRequest.findUnique({
      where: { id },
      include: {
        clothes: true,
        createdBy: true,
        participants: true,
        notifyUsers: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    // Проверка доступа (если не админ, проверяем участие)
    if (user.role !== Roles.ADMIN) {
      const isParticipant = request.participants.some((p) => p.id === user.id);
      const isCreator = request.userId === user.id;

      if (!isParticipant && !isCreator) {
        throw new ForbiddenException('У вас нет доступа к этой заявке');
      }
    }

    return request;
  }

  async findAll(user: User) {
    // 👑 Админ видит всё
    if (user.role === Roles.ADMIN) {
      return this.prisma.clothesRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          clothes: true,
          createdBy: true,
          participants: true,
          notifyUsers: true,
          comments: {
            include: {
              createdBy: true,
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }

    // 👤 Обычный пользователь
    return this.prisma.clothesRequest.findMany({
      where: {
        OR: [
          // создатель заявки
          {
            userId: user.id,
          },
          // участник заявки
          {
            participants: {
              some: {
                id: user.id,
              },
            },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        clothes: true,
        createdBy: true,
        participants: true,
        notifyUsers: true,
      },
    });
  }

  // 🔹 Создание заявки
  async create(dto: CreateClothesRequestDto, userId: string) {
    return this.prisma.clothesRequest.create({
      data: {
        title: dto.title,
        customer: dto.customer,
        status: dto.status ?? RequestStatus.CREATED,

        createdBy: {
          connect: { id: userId },
        },

        participants: dto.participantsIds
          ? { connect: dto.participantsIds.map((id) => ({ id })) }
          : undefined,

        notifyUsers: dto.notifyUsersIds
          ? { connect: dto.notifyUsersIds.map((id) => ({ id })) }
          : undefined,

        clothes: dto.clothes?.length
          ? {
              create: dto.clothes.map((c) => ({
                type: c.type,
                season: c.season,
                name: c.name,
                quantity: c.quantity,
                clothingSizeId: c.clothingSizeId,
                clothingHeightId: c.clothingHeightId,
                footwearSizeId: c.footwearSizeId,
              })),
            }
          : undefined,
      },
      include: {
        clothes: true,
        participants: true,
        notifyUsers: true,
      },
    });
  }

  // 🔹 Обновление заявки
  async update(id: string, dto: UpdateClothesRequestDto) {
    const request = await this.prisma.clothesRequest.findUnique({
      where: { id },
      include: { clothes: true },
    });

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    return this.prisma.clothesRequest.update({
      where: { id },
      data: {
        title: dto.title,
        customer: dto.customer,
        status: dto.status,

        participants: dto.participantsIds
          ? { set: dto.participantsIds.map((id) => ({ id })) }
          : undefined,

        notifyUsers: dto.notifyUsersIds
          ? { set: dto.notifyUsersIds.map((id) => ({ id })) }
          : undefined,

        clothes: dto.clothes?.length
          ? {
              // Удаляем старые позиции и создаем новые
              deleteMany: {},

              create: dto.clothes.map((c) => ({
                type: c.type,
                season: c.season,
                name: c.name,
                quantity: c.quantity,
                clothingSizeId: c.clothingSizeId,
                clothingHeightId: c.clothingHeightId,
                footwearSizeId: c.footwearSizeId,
              })),
            }
          : undefined,
      },
      include: {
        clothes: true,
        participants: true,
        notifyUsers: true,
      },
    });
  }

  // 🔹 Удаление заявки
  async remove(id: string) {
    const request = await this.prisma.clothesRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    return this.prisma.clothesRequest.delete({
      where: { id },
    });
  }

  async getCommentsByRequest(requestId: string) {
    const request = await this.prisma.clothesRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    return this.prisma.requestComment.findMany({
      where: { requestId },
      orderBy: { createdAt: 'asc' },
      include: {
        createdBy: true,
      },
    });
  }

  async addComment(
    requestId: string,
    text: string,
    user: User,
    isSystemAction = false,
  ) {
    const request = await this.prisma.clothesRequest.findUnique({
      where: { id: requestId },
      include: { participants: true, createdBy: true }, // берем тех, кого уведомить
    });

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    const newComment = await this.prisma.requestComment.create({
      data: {
        text,
        requestId,
        userId: user.id,
        isSystemComment: isSystemAction,
      },
      include: { createdBy: true },
    });

    // 🔔 ЛОГИКА УВЕДОМЛЕНИЯ
    // Если это НЕ системное действие (смена статуса), отправляем уведомление о новом комменте
    if (!isSystemAction) {
      const phones = request.participants.map((p) => p.phone);
      // Добавляем номер создателя, если его нет в участниках
      if (!phones.includes(request.createdBy.phone)) {
        phones.push(request.createdBy.phone);
      }

      const notificationText = `🔔 Новый комментарий в заявке \n\n🗂 Заявка: "${request.title}" \n\n👤 ${user.lastName} ${user.firstName} \n\n💬 ${text}`;

      // Внедряем TelegramBotService в ClothesRequestService или вызываем через сторонний механизм
      // (Не забудь добавить private readonly telegram: TelegramBotService в конструктор)
      await this.maxBot.sendBulkRequestNotifications(phones, notificationText);
    }

    return newComment;
  }

  async updateComment(commentId: string, text: string, user: User) {
    const comment = await this.prisma.requestComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    if (comment.userId !== user.id && user.role !== Roles.ADMIN) {
      throw new ForbiddenException('Нет прав на редактирование');
    }

    return this.prisma.requestComment.update({
      where: { id: commentId },
      data: { text },
      include: {
        createdBy: true,
      },
    });
  }

  async removeComment(commentId: string, user: User) {
    const comment = await this.prisma.requestComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    if (comment.userId !== user.id && user.role !== Roles.ADMIN) {
      throw new ForbiddenException('Нет прав на удаление');
    }

    return this.prisma.requestComment.delete({
      where: { id: commentId },
    });
  }

  async transferToStorage(dto: {
    requestId: string;
    items: { requestClothesId: string; quantity: number }[];
    objectId: string; // Целевой склад
    userId: string; // Кто совершает операцию
  }) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Загружаем заявку со всеми позициями
      const request = await tx.clothesRequest.findUnique({
        where: { id: dto.requestId },
        include: { clothes: true },
      });

      if (!request) throw new NotFoundException('Заявка не найдена');

      // Проверка статуса (только COMPLETED)
      if (request.status !== RequestStatus.COMPLETED) {
        throw new BadRequestException(
          'Перемещение на склад доступно только в статусе COMPLETED',
        );
      }

      for (const item of dto.items) {
        // Находим позицию в заявке
        const sourceItem = request.clothes.find(
          (c) => c.id === item.requestClothesId,
        );

        if (!sourceItem) {
          throw new NotFoundException(
            `Позиция ID:${item.requestClothesId} не найдена в заявке`,
          );
        }

        // ПРОВЕРКА: Доступное количество для перемещения
        const availableToTransfer =
          sourceItem.quantity - sourceItem.transferredQuantity;
        if (item.quantity > availableToTransfer) {
          throw new BadRequestException(
            `Превышено количество для "${sourceItem.name}". ` +
              `Осталось переместить: ${availableToTransfer}, вы указали: ${item.quantity}`,
          );
        }

        // 2. Ищем карточку товара на складе (по уникальному индексу)
        const existingStock = await tx.clothes.findFirst({
          where: {
            objectId: dto.objectId,
            name: sourceItem.name,
            type: sourceItem.type,
            season: sourceItem.season,
            clothingHeightId: (sourceItem.clothingHeightId ?? null) as string,
            clothingSizeId: (sourceItem.clothingSizeId ?? null) as string,
            footwearSizeId: (sourceItem.footwearSizeId ?? null) as string,
          },
        });

        // Если карточки нет — ошибка (согласно вашему требованию)
        if (!existingStock) {
          throw new BadRequestException({
            message: `На складе отсутствует карточка для "${sourceItem.name}"`,
            error: 'MISSING_STOCK_CARD',
            // Передаем ID позиции из заявки, чтобы фронт её подсветил
            requestClothesId: item.requestClothesId,
          });
        }

        // 3. Обновляем остаток на складе
        await tx.clothes.update({
          where: { id: existingStock.id },
          data: { quantity: { increment: item.quantity } },
        });

        // 4. Увеличиваем счетчик перемещенного в заявке (transferredQuantity)
        await tx.requestClothes.update({
          where: { id: sourceItem.id },
          data: { transferredQuantity: { increment: item.quantity } },
        });

        // 5. Регистрируем запись в истории склада
        await tx.clothesHistory.create({
          data: {
            action: ClothesActions.ADD,
            clothesId: existingStock.id,
            userId: dto.userId,
            quantity: item.quantity,
            toObjectId: dto.objectId,
            writeOffComment: `Приход по заявке №${String(request.number).padStart(5, '0')}`,
          },
        });
      }

      // 6. Проверка на полное закрытие заявки
      const updatedRequest = await tx.clothesRequest.findUnique({
        where: { id: dto.requestId },
        include: { clothes: true },
      });

      // Добавляем проверку на существование (safety first)
      if (!updatedRequest || !updatedRequest.clothes) {
        throw new NotFoundException('Ошибка при финальной проверки заявки');
      }

      // Считаем остаток
      const totalPending = updatedRequest.clothes.reduce(
        (acc, item) => acc + (item.quantity - item.transferredQuantity),
        0,
      );

      // Если всё перемещено под ноль — переводим в CLOSED
      if (totalPending === 0) {
        await tx.clothesRequest.update({
          where: { id: dto.requestId },
          data: { status: RequestStatus.CLOSED },
        });

        await tx.requestComment.create({
          data: {
            text: `Все позиции по заявке №${request.number} успешно перемещены на склад. Заявка закрыта.`,
            userId: dto.userId,
            requestId: dto.requestId,
            isSystemComment: true,
          },
        });
      }

      return {
        success: true,
        completed: totalPending === 0,
      };
    });
  }
}
