import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PenaltyStatus, Prisma } from '@prisma/client';
import {
  CreateEmployeePenaltyDto,
  CreatePenaltyCommentDto,
  GetPenaltyFilterDto,
  UpdateEmployeePenaltyDto,
} from './dto/request-penalty.dto';

@Injectable()
export class EmployeePenaltyService {
  constructor(private prisma: PrismaService) {}

  // Вспомогательный метод, чтобы не дублировать поиск и проверку на null
  private async getPenaltyOrThrow(id: string) {
    const penalty = await this.prisma.employeePenalty.findUnique({
      where: { id },
    });
    if (!penalty) throw new NotFoundException('Штраф не найден');
    return penalty;
  }

  // 1. Создание заявки (Мастер)
  async create(creatorId: string, dto: CreateEmployeePenaltyDto) {
    return this.prisma.employeePenalty.create({
      data: {
        amount: dto.amount,
        reason: dto.reason,
        description: dto.description,
        employeeId: dto.employeeId,
        objectId: dto.objectId,
        creatorId: creatorId,
        status: PenaltyStatus.PENDING,
        date: new Date(dto.date),
      },
    });
  }

  // 2. Универсальный Update (Мастер или Руководитель)
  async update(id: string, dto: UpdateEmployeePenaltyDto) {
    const penalty = await this.getPenaltyOrThrow(id);

    if (penalty.status === PenaltyStatus.PROCESSED) {
      throw new BadRequestException(
        'Нельзя редактировать уже обработанный штраф',
      );
    }

    // Используем типизированный объект вместо any
    // Prisma.EmployeePenaltyUpdateInput описывает все поля, которые можно обновить
    const updateData: Prisma.EmployeePenaltyUpdateInput = {
      amount: dto.amount,
      reason: dto.reason,
      description: dto.description,
      // Если объект передан в DTO, мапим его на структуру Prisma
      object: dto.objectId ? { connect: { id: dto.objectId } } : undefined,
      // Преобразуем строку даты в объект Date, если она есть
      date: dto.date ? new Date(dto.date) : undefined,
      status: PenaltyStatus.PENDING,
    };

    return this.prisma.employeePenalty.update({
      where: { id },
      data: updateData, // Передаем подготовленные данные
    });
  }

  // 3. Согласование (Руководитель)
  async approve(id: string, approverId: string) {
    const penalty = await this.getPenaltyOrThrow(id);

    if (penalty.status !== PenaltyStatus.PENDING) {
      throw new BadRequestException(
        'Можно согласовать только заявки в статусе PENDING',
      );
    }

    return this.prisma.employeePenalty.update({
      where: { id },
      data: {
        status: PenaltyStatus.APPROVED,
        approverId: approverId,
      },
    });
  }

  // 4. Финализация (Бухгалтер)
  async process(id: string, accountantId: string) {
    const penalty = await this.getPenaltyOrThrow(id);

    if (penalty.status !== PenaltyStatus.APPROVED) {
      throw new BadRequestException(
        'Бухгалтер может обработать только согласованные (APPROVED) штрафы',
      );
    }

    return this.prisma.employeePenalty.update({
      where: { id },
      data: {
        status: PenaltyStatus.PROCESSED,
        accountantId: accountantId,
        processedAt: new Date(),
      },
    });
  }

  // 5. Отклонение
  async reject(id: string, userId: string, reason?: string) {
    const penalty = await this.getPenaltyOrThrow(id);

    if (penalty.status !== PenaltyStatus.PENDING) {
      throw new BadRequestException(
        'Можно отклонить только заявки в статусе "На согласовании"',
      );
    }

    // Создаем системный комментарий об отклонении
    await this.addComment(
      userId,
      { text: `Заявка отклонена. ${reason ? 'Причина: ' + reason : ''}` },
      id, // Передаем id штрафа напрямую
      true,
    );

    return this.prisma.employeePenalty.update({
      where: { id },
      data: { status: PenaltyStatus.REJECTED },
    });
  }

  async cancel(id: string, userId: string) {
    const penalty = await this.getPenaltyOrThrow(id);

    // Запрещаем отменять, если штраф уже проведен бухгалтером
    if (penalty.status === PenaltyStatus.PROCESSED) {
      throw new BadRequestException(
        'Нельзя отменить уже проведенный в системе штраф',
      );
    }

    // Если заявка уже отменена — ничего не делаем или кидаем ошибку
    if (penalty.status === PenaltyStatus.CANCELED) {
      throw new BadRequestException('Заявка уже отменена');
    }

    // Добавляем системный комментарий об отмене
    await this.addComment(
      userId,
      { text: `Заявка отменена.` },
      id, // Передаем id штрафа напрямую
      true,
    );

    return this.prisma.employeePenalty.update({
      where: { id },
      data: {
        status: PenaltyStatus.CANCELED,
      },
    });
  }

  async addComment(
    userId: string,
    dto: CreatePenaltyCommentDto,
    penaltyId: string,
    isSystem = false,
  ) {
    return this.prisma.employeePenaltyComment.create({
      data: {
        text: dto.text,
        isSystemComment: isSystem,
        userId: userId,
        employeePenaltyId: penaltyId,
      },
      include: {
        createdBy: {
          select: { firstName: true, lastName: true },
        },
      },
    });
  }

  async deleteComment(commentId: string, userId: string, userRole: string) {
    const comment = await this.prisma.employeePenaltyComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    // Запрещаем удалять системные уведомления
    if (comment.isSystemComment) {
      throw new BadRequestException('Системные записи нельзя удалять');
    }

    // Проверка авторства: либо владелец, либо администратор
    const isOwner = comment.userId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Вы можете удалять только свои комментарии');
    }

    return this.prisma.employeePenaltyComment.delete({
      where: { id: commentId },
    });
  }

  // Получение статистики (здесь findMany возвращает массив, так что null не будет)
  async getEmployeePenaltyStats(employeeId: string) {
    const penalties = await this.prisma.employeePenalty.findMany({
      where: { employeeId },
    });

    const totalProcessed = penalties
      .filter((p) => p.status === PenaltyStatus.PROCESSED)
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = penalties
      .filter(
        (p) =>
          p.status === PenaltyStatus.APPROVED ||
          p.status === PenaltyStatus.PENDING,
      )
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      history: penalties,
      totalProcessed,
      totalPending,
    };
  }

  async findAll(filters: GetPenaltyFilterDto) {
    const { status, employeeId, objectId, startDate, endDate } = filters;

    const where: Prisma.EmployeePenaltyWhereInput = {
      status,
      employeeId,
      objectId,
    };

    if (startDate || endDate) {
      where.date = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    return this.prisma.employeePenalty.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fatherName: true,
            position: true,
          },
        },
        object: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        approver: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        accountant: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Сначала свежие заявки
      },
    });
  }

  // Метод для получения одной конкретной записи (нужен для страницы деталей или модалки редактирования)
  async findOne(id: string) {
    const penalty = await this.prisma.employeePenalty.findUnique({
      where: { id },
      include: {
        employee: true,
        object: true,
        creator: true,
        approver: true,
        accountant: true,
      },
    });

    if (!penalty) throw new NotFoundException('Запись о штрафе не найдена');
    return penalty;
  }

  async findComments(penaltyId: string) {
    return this.prisma.employeePenaltyComment.findMany({
      where: { employeePenaltyId: penaltyId },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'asc' }, // Комменты обычно читают сверху вниз
    });
  }
}
