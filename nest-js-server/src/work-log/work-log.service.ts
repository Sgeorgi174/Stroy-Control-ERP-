import { Injectable } from '@nestjs/common';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3WorkLogPhotosService } from 'src/s3/s3-work-log-photo.service';

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

  // async update(
  //   id: string,
  //   dto: UpdateWorkLogDto,
  //   files: Express.Multer.File[],
  // ) {
  //   const uploadedPhotoUrls = await this.s3Photos.uploadPhotos(files);

  //   return this.prisma.$transaction(async (tx) => {
  //     // 2. Удаляем фото (если есть)
  //     if (dto.removedPhotoIds?.length) {
  //       const photosToDelete = await tx.workLogPhoto.findMany({
  //         where: { id: { in: dto.removedPhotoIds } },
  //       });

  //       // удаляем из S3
  //       await Promise.all(
  //         photosToDelete.map((p) => this.s3Photos.deletePhoto(p.url)),
  //       );

  //       // удаляем из БД
  //       await tx.workLogPhoto.deleteMany({
  //         where: { id: { in: dto.removedPhotoIds } },
  //       });
  //     }

  //     // 3. Обновляем сам лог
  //     const updated = await tx.workLog.update({
  //       where: { id },
  //       data: {
  //         ...(dto.date && { date: new Date(dto.date) }),

  //         // полностью пересоздаём items (самый простой и надежный способ)
  //         ...(dto.items && {
  //           items: {
  //             deleteMany: {}, // удаляем старые
  //             create: dto.items.map((item) => ({
  //               text: item.text,
  //             })),
  //           },
  //         }),

  //         // добавляем новые фото
  //         ...(uploadedPhotoUrls.length && {
  //           photos: {
  //             create: uploadedPhotoUrls.map((url) => ({ url })),
  //           },
  //         }),
  //       },
  //       include: {
  //         items: true,
  //         photos: true,
  //       },
  //     });

  //     return updated;
  //   });
  // }

  async remove(id: string) {
    return this.prisma.workLog.delete({ where: { id } });
  }
}
