import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OvertimeStatus, Prisma } from '@prisma/client';
import {
  CreateEmployeeOvertimeDto,
  CreateOvertimeCommentDto,
  GetOvertimeFilterDto,
  UpdateEmployeeOvertimeDto,
} from './dto/request-overtime.dto';

@Injectable()
export class RequestOvertimeService {
  constructor(private prisma: PrismaService) {}

  private async getOvertimeOrThrow(id: string) {
    const overtime = await this.prisma.employeeOvertime.findUnique({
      where: { id },
    });
    if (!overtime)
      throw new NotFoundException('Запись о доп. часах не найдена');
    return overtime;
  }

  // 1. Создание заявки (Мастер)
  async create(creatorId: string, dto: CreateEmployeeOvertimeDto) {
    return this.prisma.employeeOvertime.create({
      data: {
        hours: dto.hours,
        description: dto.description,
        employeeId: dto.employeeId,
        objectId: dto.objectId,
        creatorId: creatorId,
        status: OvertimeStatus.PENDING,
        date: new Date(dto.date),
      },
    });
  }

  // 2. Обновление (пока не PROCESSED)
  async update(id: string, dto: UpdateEmployeeOvertimeDto) {
    const overtime = await this.getOvertimeOrThrow(id);

    if (overtime.status === OvertimeStatus.PROCESSED) {
      throw new BadRequestException(
        'Нельзя редактировать уже проведенные часы',
      );
    }

    const updateData: Prisma.EmployeeOvertimeUpdateInput = {
      hours: dto.hours,
      description: dto.description,
      object: dto.objectId ? { connect: { id: dto.objectId } } : undefined,
      date: dto.date ? new Date(dto.date) : undefined,
      status: OvertimeStatus.PENDING, // Сбрасываем на PENDING при изменении
    };

    return this.prisma.employeeOvertime.update({
      where: { id },
      data: updateData,
    });
  }

  // 3. Согласование (Менеджер/Руководитель)
  async approve(id: string, approverId: string) {
    const overtime = await this.getOvertimeOrThrow(id);

    if (overtime.status !== OvertimeStatus.PENDING) {
      throw new BadRequestException(
        'Согласовать можно только заявки в статусе PENDING',
      );
    }

    return this.prisma.employeeOvertime.update({
      where: { id },
      data: {
        status: OvertimeStatus.APPROVED,
        approverId: approverId,
      },
    });
  }

  // 4. Проведение (Бухгалтер)
  async process(id: string, accountantId: string) {
    const overtime = await this.getOvertimeOrThrow(id);

    if (overtime.status !== OvertimeStatus.APPROVED) {
      throw new BadRequestException(
        'Обработать можно только согласованные (APPROVED) часы',
      );
    }

    return this.prisma.employeeOvertime.update({
      where: { id },
      data: {
        status: OvertimeStatus.PROCESSED,
        accountantId: accountantId,
        processedAt: new Date(),
      },
    });
  }

  // 5. Отклонение
  async reject(id: string, userId: string, reason?: string) {
    const overtime = await this.getOvertimeOrThrow(id);

    if (
      overtime.status !== OvertimeStatus.PENDING &&
      overtime.status !== OvertimeStatus.APPROVED
    ) {
      throw new BadRequestException(
        'Нельзя отклонить уже обработанную или отмененную заявку',
      );
    }

    await this.addComment(
      userId,
      {
        text: `Заявка на доп. часы отклонена. ${reason ? 'Причина: ' + reason : ''}`,
      },
      id,
      true,
    );

    return this.prisma.employeeOvertime.update({
      where: { id },
      data: { status: OvertimeStatus.REJECTED },
    });
  }

  // 6. Отмена создателем
  async cancel(id: string, userId: string) {
    const overtime = await this.getOvertimeOrThrow(id);

    if (overtime.status === OvertimeStatus.PROCESSED) {
      throw new BadRequestException('Нельзя отменить уже проведенные часы');
    }

    await this.addComment(userId, { text: `Заявка отменена.` }, id, true);

    return this.prisma.employeeOvertime.update({
      where: { id },
      data: { status: OvertimeStatus.CANCELED },
    });
  }

  // --- Система комментариев ---
  async addComment(
    userId: string,
    dto: CreateOvertimeCommentDto,
    overtimeId: string,
    isSystem = false,
  ) {
    return this.prisma.employeeOvertimeComment.create({
      data: {
        text: dto.text,
        isSystemComment: isSystem,
        userId: userId,
        overtimeId: overtimeId,
      },
      include: {
        createdBy: { select: { firstName: true, lastName: true } },
      },
    });
  }

  async findComments(overtimeId: string) {
    return this.prisma.employeeOvertimeComment.findMany({
      where: { overtimeId },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async deleteComment(commentId: string, userId: string, userRole: string) {
    const comment = await this.prisma.employeeOvertimeComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException('Комментарий не найден');
    if (comment.isSystemComment)
      throw new BadRequestException('Системные записи нельзя удалять');

    if (comment.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Нет прав на удаление');
    }

    return this.prisma.employeeOvertimeComment.delete({
      where: { id: commentId },
    });
  }

  // --- Поиск и Статистика ---
  async getEmployeeOvertimeStats(employeeId: string) {
    const overtimes = await this.prisma.employeeOvertime.findMany({
      where: { employeeId },
    });

    const totalProcessedHours = overtimes
      .filter((o) => o.status === OvertimeStatus.PROCESSED)
      .reduce((sum, o) => sum + o.hours, 0);

    const totalPendingHours = overtimes
      .filter(
        (o) =>
          o.status === OvertimeStatus.PENDING ||
          o.status === OvertimeStatus.APPROVED,
      )
      .reduce((sum, o) => sum + o.hours, 0);

    return {
      history: overtimes,
      totalProcessedHours,
      totalPendingHours,
    };
  }

  async findAll(filters: GetOvertimeFilterDto) {
    const { status, employeeId, objectId, startDate, endDate } = filters;

    const where: Prisma.EmployeeOvertimeWhereInput = {
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

    return this.prisma.employeeOvertime.findMany({
      where,
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, position: true },
        },
        object: { select: { id: true, name: true } },
        creator: { select: { firstName: true, lastName: true } },
        approver: { select: { firstName: true, lastName: true } },
        accountant: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const overtime = await this.prisma.employeeOvertime.findUnique({
      where: { id },
      include: {
        employee: true,
        object: true,
        creator: true,
        approver: true,
        accountant: true,
      },
    });

    if (!overtime) throw new NotFoundException('Запись не найдена');
    return overtime;
  }
}
