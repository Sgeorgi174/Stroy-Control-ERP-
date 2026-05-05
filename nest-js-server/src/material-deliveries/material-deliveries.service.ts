import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Путь к твоему PrismaService
import { S3MaterialPhotosService } from 'src/s3/s3-material-photo.service';
import {
  CreateMaterialDeliveryDto,
  UpdateMaterialDeliveryDto,
} from './dto/material-deliveries.dto';

@Injectable()
export class MaterialDeliveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3MaterialPhotosService,
  ) {}

  // 1. Получение записей за месяц
  async findAllByMonth(objectId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return this.prisma.materialDelivery.findMany({
      where: {
        objectId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        photos: true,
        master: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  // 2. Создание записи
  async create(
    userId: string,
    dto: CreateMaterialDeliveryDto,
    files: Express.Multer.File[],
  ) {
    const photoUrls = await this.s3Service.uploadPhotos(files);

    return this.prisma.materialDelivery.create({
      data: {
        date: new Date(dto.date),
        objectId: dto.objectId,
        masterId: userId,
        photos: {
          create: photoUrls.map((url) => ({ url })),
        },
      },
      include: {
        photos: true,
        master: { select: { firstName: true, lastName: true } },
      },
    });
  }

  // 3. Редактирование записи
  async update(
    id: string,
    userId: string,
    dto: UpdateMaterialDeliveryDto,
    newFiles: Express.Multer.File[],
  ) {
    const delivery = await this.prisma.materialDelivery.findUnique({
      where: { id },
      include: { photos: true },
    });

    if (!delivery) throw new NotFoundException('Запись не найдена');

    const currentPhotoUrls = delivery.photos.map((p) => p.url);

    // Создаем переменную, которая точно будет массивом
    // Если фронтенд ничего не прислал (undefined), считаем, что список фото не менялся
    let finalPhotoUrls = dto.existingPhotos || currentPhotoUrls;

    // 1. Обработка удаления физических файлов из S3
    if (dto.existingPhotos) {
      // Сохраняем ссылку на массив в константу, чтобы TS не ругался внутри колбэка
      const existing = dto.existingPhotos;

      const photosToDelete = currentPhotoUrls.filter(
        (url) => !existing.includes(url),
      );

      if (photosToDelete.length > 0) {
        await this.s3Service.deletePhotos(photosToDelete);
      }
    }

    // 2. Загружаем новые фото
    if (newFiles && newFiles.length > 0) {
      const uploadedUrls = await this.s3Service.uploadPhotos(newFiles);
      finalPhotoUrls = [...finalPhotoUrls, ...uploadedUrls];
    }

    // 3. Обновляем запись в БД
    return this.prisma.$transaction(async (tx) => {
      // Сначала удаляем старые записи связей в БД
      await tx.materialPhoto.deleteMany({ where: { deliveryId: id } });

      // Обновляем саму доставку и создаем новые связи
      return tx.materialDelivery.update({
        where: { id },
        data: {
          date: dto.date ? new Date(dto.date) : undefined,
          photos: {
            create: finalPhotoUrls.map((url) => ({ url })),
          },
        },
        include: {
          photos: true,
          master: { select: { firstName: true, lastName: true } },
        },
      });
    });
  }

  // 4. Удаление записи
  async remove(id: string) {
    const delivery = await this.prisma.materialDelivery.findUnique({
      where: { id },
      include: { photos: true },
    });

    if (!delivery) throw new NotFoundException('Запись не найдена');

    // Удаляем все файлы из облака
    const urls = delivery.photos.map((p) => p.url);
    await this.s3Service.deletePhotos(urls);

    // Удаляем из БД (MaterialPhoto удалятся по Cascade)
    return this.prisma.materialDelivery.delete({
      where: { id },
    });
  }
}
