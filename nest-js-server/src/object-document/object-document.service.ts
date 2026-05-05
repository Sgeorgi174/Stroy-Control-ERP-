import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateObjectDocumentDto } from './dto/object-document.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3ObjectDocumentsService } from 'src/s3/s3-object-doc.service';
import { ObjectDocType } from '@prisma/client';

@Injectable()
export class ObjectDocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3ObjectDocumentsService,
  ) {}

  async create(
    masterId: string,
    dto: CreateObjectDocumentDto,
    file?: Express.Multer.File,
  ) {
    let fileUrl: string | undefined;
    let fileName: string | undefined;

    // 1. Загружаем файл в S3, если он есть
    if (file) {
      fileUrl = await this.s3Service.uploadDocument(file);
      fileName = file.originalname;
    }

    // 2. Создаем запись в базе
    return this.prisma.objectDocument.create({
      data: {
        name: dto.name,
        type: dto.type,
        comment: dto.comment,
        objectId: dto.objectId,
        masterId: masterId,
        fileUrl,
        fileName,
        // Связываем с существующими инструментами
        tools: {
          connect: dto.toolIds?.map((id) => ({ id })) || [],
        },
        // Связываем с существующими девайсами
        devices: {
          connect: dto.deviceIds?.map((id) => ({ id })) || [],
        },
      },
      include: {
        master: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        tools: {
          select: { id: true, name: true, serialNumber: true },
        },
        devices: {
          select: { id: true, name: true, serialNumber: true },
        },
      },
    });
  }

  async findAll(objectId: string, type?: string, search?: string) {
    return this.prisma.objectDocument.findMany({
      where: {
        objectId,
        // Фильтрация по табу
        ...(type && type !== 'ALL' ? { type: type as ObjectDocType } : {}),
        // Расширенный поиск
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { comment: { contains: search, mode: 'insensitive' } },
                {
                  tools: {
                    some: {
                      OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        {
                          serialNumber: {
                            contains: search,
                            mode: 'insensitive',
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  devices: {
                    some: {
                      OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        {
                          serialNumber: {
                            contains: search,
                            mode: 'insensitive',
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        master: { select: { firstName: true, lastName: true } },
        devices: { select: { id: true, name: true, serialNumber: true } },
        tools: { select: { id: true, name: true, serialNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const doc = await this.prisma.objectDocument.findUnique({
      where: { id },
      include: {
        tools: true,
        devices: true,
        master: true,
      },
    });

    if (!doc) throw new NotFoundException('Документ не найден');
    return doc;
  }

  async update(
    id: string,
    dto: Partial<CreateObjectDocumentDto>,
    file?: Express.Multer.File,
  ) {
    const currentDoc = await this.findOne(id);
    let fileData = {};

    // 1. Работа с файлом
    if (file) {
      // Удаляем старый файл из облака, если он был
      if (currentDoc.fileUrl) {
        await this.s3Service.deleteDocument(currentDoc.fileUrl);
      }
      // Загружаем новый
      const newFileUrl = await this.s3Service.uploadDocument(file);
      fileData = {
        fileUrl: newFileUrl,
        fileName: file.originalname,
      };
    }

    // 2. Обновление записи
    return this.prisma.objectDocument.update({
      where: { id },
      data: {
        name: dto.name,
        type: dto.type,
        comment: dto.comment,
        ...fileData,
        // Обновляем связи (set заменяет старый список на новый)
        tools: {
          set: dto.toolIds?.map((id) => ({ id })) || [],
        },
        devices: {
          set: dto.deviceIds?.map((id) => ({ id })) || [],
        },
      },
      include: {
        master: { select: { firstName: true, lastName: true } },
        tools: true,
        devices: true,
      },
    });
  }

  async remove(id: string) {
    const doc = await this.findOne(id);

    // 1. Удаляем файл из S3
    if (doc.fileUrl) {
      await this.s3Service.deleteDocument(doc.fileUrl);
    }

    // 2. Удаляем запись из БД
    return this.prisma.objectDocument.delete({
      where: { id },
    });
  }
}
