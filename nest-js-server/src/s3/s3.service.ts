import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createS3Client } from './s3.client';
import { UploadFileDto } from './dto/upload-file.dto';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = createS3Client(this.configService);
  }

  async uploadImage(file: Express.Multer.File, dto: UploadFileDto) {
    if (!file) throw new BadRequestException('Файл не передан');

    this.validateFile(file);

    const key = this.generateFilePath(file, dto);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow<string>('S3_BUCKET'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      url: this.getFileUrl(key),
      path: key,
    };
  }

  private validateFile(file: Express.Multer.File) {
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Файл слишком большой (максимум 5MB)');
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('Недопустимый тип файла');
    }
  }

  private generateFilePath(
    file: Express.Multer.File,
    dto: UploadFileDto,
  ): string {
    const ext = file.originalname.split('.').pop();

    // Убираем / в конце папки
    const folder = dto.folder.replace(/\/$/, '');

    // Генерируем ключ
    return `${folder}/${dto.filename}.${ext}`;
  }

  getFileUrl(key: string): string {
    const bucket = this.configService.getOrThrow<string>('S3_BUCKET');
    const endpoint = this.configService.getOrThrow<string>('S3_ENDPOINT');

    return `${endpoint}/${bucket}/${key}`;
  }
}
