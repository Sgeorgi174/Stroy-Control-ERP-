import { Injectable } from '@nestjs/common';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3WorkLogPhotosService } from 'src/s3/s3-work-log-photo.service';
import { UpdateWorkLogDto } from './dto/update-work-log.dto';

@Injectable()
export class WorkLogService {
  constructor(
    private prisma: PrismaService,
    private s3Photos: S3WorkLogPhotosService,
  ) {}

  async create(
    userId: string,
    dto: CreateWorkLogDto,
    files: Express.Multer.File[],
  ) {
    // 1. Загружаем фото в S3 и получаем массив URL
    const uploadedPhotoUrls = await this.s3Photos.uploadPhotos(files);

    // 2. Создаем запись в БД
    return this.prisma.workLog.create({
      data: {
        date: new Date(dto.date),
        objectId: dto.objectId,
        userId: userId,
        items: {
          create: dto.items.map((item) => ({ text: item.text })),
        },
        photos: {
          // Комбинируем URL из S3 (если прислали файлы)
          // и URL из DTO (если вдруг передали ссылки текстом)
          create: uploadedPhotoUrls.map((url) => ({ url })),
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

  async update(
    id: string,
    dto: UpdateWorkLogDto,
    newFiles: Express.Multer.File[],
  ) {
    // 1. Получаем текущую запись с фото и пунктами
    const currentLog = await this.prisma.workLog.findUnique({
      where: { id },
      include: { photos: true, items: true },
    });

    if (!currentLog) throw new Error('Запись не найдена');

    // 2. Работа с фотографиями
    const existingPhotosUrls = dto.existingPhotos || [];
    const photosToDelete = currentLog.photos.filter(
      (p) => !existingPhotosUrls.includes(p.url),
    );

    // Удаляем файлы из S3
    if (photosToDelete.length > 0) {
      await Promise.all(
        photosToDelete.map((p) => this.s3Photos.deletePhoto(p.url)),
      );
    }

    // Загружаем новые фото
    const uploadedPhotoUrls = await this.s3Photos.uploadPhotos(newFiles);
    const finalPhotoUrls = [...existingPhotosUrls, ...uploadedPhotoUrls];

    // 3. Транзакция в БД
    return this.prisma.workLog.update({
      where: { id },
      data: {
        date: dto.date ? new Date(dto.date) : currentLog.date,
        objectId: dto.objectId || currentLog.objectId,
        // Обновляем пункты: удаляем старые и создаем новые
        items: {
          deleteMany: {},
          create: dto.items?.map((item) => ({ text: item.text })) || [],
        },
        // Обновляем фото в БД
        photos: {
          deleteMany: {},
          create: finalPhotoUrls.map((url) => ({ url })),
        },
      },
      include: {
        items: true,
        photos: true,
      },
    });
  }
}
