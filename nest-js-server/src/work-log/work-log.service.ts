import { Injectable } from '@nestjs/common';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkLogService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkLogDto) {
    return this.prisma.workLog.create({
      data: {
        date: new Date(dto.date),
        objectId: dto.objectId,
        userId: userId,
        // Создаем вложенные записи сразу
        items: {
          create: dto.items.map((item) => ({ text: item.text })),
        },
        photos: {
          create: dto.photos?.map((url) => ({ url })) || [],
        },
      },
      include: {
        items: true,
        photos: true,
      },
    });
  }

  async findByMonth(objectId: string, year: number, month: number) {
    // Создаем дату начала месяца (например, 2026-01-01)
    const startDate = new Date(year, month - 1, 1);
    // Создаем дату начала следующего месяца (например, 2026-02-01)
    const endDate = new Date(year, month, 1);

    return this.prisma.workLog.findMany({
      where: {
        objectId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        items: true,
        photos: true,
        object: { select: { name: true } },
        master: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getActiveDates(objectId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const logs = await this.prisma.workLog.findMany({
      where: {
        objectId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        date: true, // Берем только дату
      },
    });

    // Возвращаем массив уникальных дней (чисел), чтобы фронту было удобно
    // Например: [1, 5, 12, 13, 20]
    const activeDays = [...new Set(logs.map((log) => log.date.getDate()))];
    return activeDays.sort((a, b) => a - b);
  }

  async remove(id: string) {
    return this.prisma.workLog.delete({ where: { id } });
  }
}
