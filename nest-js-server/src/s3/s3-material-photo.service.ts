import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createS3Client } from './s3.client'; // Используем твой существующий клиент
import { randomUUID } from 'crypto';

@Injectable()
export class S3MaterialPhotosService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = createS3Client(this.configService);
  }

  async uploadPhotos(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) return [];

    // Лимит для накладных/материалов — 10 штук
    if (files.length > 10) {
      throw new BadRequestException(
        'Можно загрузить не более 10-ти фотографий',
      );
    }

    const uploadPromises = files.map((file) => this.uploadSinglePhoto(file));
    return Promise.all(uploadPromises);
  }

  private async uploadSinglePhoto(file: Express.Multer.File): Promise<string> {
    this.validateImage(file);

    const fileExtension = file.originalname.split('.').pop();
    // Папка material-deliveries вместо work-logs
    const key = `material-deliveries/${randomUUID()}.${fileExtension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow<string>('S3_BUCKET'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return this.getFileUrl(key);
  }

  private validateImage(file: Express.Multer.File) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Недопустимый формат файла: 
        ${file.originalname}`,
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException(
        `Файл ${file.originalname} слишком тяжелый (max 10MB)`,
      );
    }
  }

  private getFileUrl(key: string): string {
    const bucket = this.configService.getOrThrow<string>('S3_BUCKET');
    const endpoint = this.configService.getOrThrow<string>('S3_ENDPOINT');
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

  async deletePhotos(fileUrls: string[]): Promise<void> {
    if (!fileUrls?.length) return;
    await Promise.all(
      fileUrls.map(async (url) => {
        const key = this.extractKeyFromUrl(url);
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.configService.getOrThrow<string>('S3_BUCKET'),

            Key: key,
          }),
        );
      }),
    );
  }
}
