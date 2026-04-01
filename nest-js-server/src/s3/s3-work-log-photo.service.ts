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
export class S3WorkLogPhotosService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = createS3Client(this.configService);
  }

  async uploadPhotos(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) return [];

    // Ограничение на 3 фото
    if (files.length > 3) {
      throw new BadRequestException('Можно загрузить не более 3-х фотографий');
    }

    const uploadPromises = files.map((file) => this.uploadSinglePhoto(file));
    return Promise.all(uploadPromises);
  }

  private async uploadSinglePhoto(file: Express.Multer.File): Promise<string> {
    this.validateImage(file);

    const fileExtension = file.originalname.split('.').pop();
    const key = `work-logs/${randomUUID()}.${fileExtension}`;

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
        `Недопустимый формат файла: ${file.originalname}`,
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB лимит для фото
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

  async deletePhoto(fileUrl: string): Promise<void> {
    const key = this.extractKeyFromUrl(fileUrl);

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.configService.getOrThrow<string>('S3_BUCKET'),
        Key: key,
      }),
    );
  }

  async deletePhotos(fileUrls: string[]): Promise<void> {
    if (!fileUrls?.length) return;

    await Promise.all(fileUrls.map((url) => this.deletePhoto(url)));
  }
}
