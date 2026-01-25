import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createS3Client } from './s3.client';
import { UploadDocumentDto } from './dto/upload-document.dto';

@Injectable()
export class S3DocumentsService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = createS3Client(this.configService);
  }

  async uploadDocument(file: Express.Multer.File, dto: UploadDocumentDto) {
    if (!file) {
      throw new BadRequestException('Файл не передан');
    }

    this.validateDocument(file);

    const key = this.generateFilePath(file, dto);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow<string>('S3_BUCKET'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline', // или attachment
      }),
    );

    return {
      url: this.getFileUrl(key),
      path: key,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  // ---------------- private ----------------

  private validateDocument(file: Express.Multer.File) {
    if (file.size > 20 * 1024 * 1024) {
      throw new BadRequestException('Файл слишком большой (максимум 20MB)');
    }

    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Недопустимый тип документа');
    }
  }

  private generateFilePath(
    file: Express.Multer.File,
    dto: UploadDocumentDto,
  ): string {
    const ext = file.originalname.split('.').pop();
    const folder = dto.folder.replace(/\/$/, '');

    return `${folder}/${dto.filename}.${ext}`;
  }

  private getFileUrl(key: string): string {
    const bucket = this.configService.getOrThrow<string>('S3_BUCKET');
    const endpoint = this.configService.getOrThrow<string>('S3_ENDPOINT');

    return `${endpoint}/${bucket}/${key}`;
  }
}
