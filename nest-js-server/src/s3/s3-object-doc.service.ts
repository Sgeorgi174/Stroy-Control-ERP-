import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createS3Client } from './s3.client';
import { randomUUID } from 'crypto';

@Injectable()
export class S3ObjectDocumentsService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = createS3Client(this.configService);
  }

  /**
   * Загрузка одного файла (документ или фото)
   */
  async uploadDocument(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }

    this.validateFile(file);

    const fileExtension = file.originalname.split('.').pop();
    // Сохраняем в папку object-documents
    const key = `object-documents/${randomUUID()}.${fileExtension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow<string>('S3_BUCKET'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // Если нужно, чтобы файл скачивался с оригинальным именем при клике:
        ContentDisposition: `inline; filename="${encodeURIComponent(file.originalname)}"`,
      }),
    );

    return this.getFileUrl(key);
  }

  /**
   * Валидация: разрешаем картинки + офисные документы
   */
  private validateFile(file: Express.Multer.File) {
    const allowedMimeTypes = [
      // Изображения
      'image/jpeg',
      'image/png',
      'image/webp',
      // Документы
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Недопустимый формат файла: ${file.originalname}. Разрешены только изображения, PDF и документы MS Office.`,
      );
    }

    // Лимит 15 МБ для документов (чуть больше, чем для фото)
    if (file.size > 15 * 1024 * 1024) {
      throw new BadRequestException(
        `Файл ${file.originalname} слишком тяжелый (max 15MB)`,
      );
    }
  }

  private getFileUrl(key: string): string {
    const bucket = this.configService.getOrThrow<string>('S3_BUCKET');
    const endpoint = this.configService.getOrThrow<string>('S3_ENDPOINT');
    // Формируем URL. Убедись, что endpoint включает https://
    return `${endpoint}/${bucket}/${key}`;
  }

  private extractKeyFromUrl(url: string): string {
    const bucket = this.configService.getOrThrow<string>('S3_BUCKET');
    const endpoint = this.configService.getOrThrow<string>('S3_ENDPOINT');
    const prefix = `${endpoint}/${bucket}/`;

    if (!url.startsWith(prefix)) {
      throw new BadRequestException('Некорректный URL файла');
    }
    return url.replace(prefix, '');
  }

  /**
   * Удаление файла
   */
  async deleteDocument(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    try {
      const key = this.extractKeyFromUrl(fileUrl);
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.configService.getOrThrow<string>('S3_BUCKET'),
          Key: key,
        }),
      );
    } catch (error) {
      // Логируем ошибку, но не прерываем процесс, если файл уже удален
      console.error('Ошибка при удалении файла из S3:', error);
    }
  }
}
