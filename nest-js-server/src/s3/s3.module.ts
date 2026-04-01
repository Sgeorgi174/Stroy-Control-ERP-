import { Module } from '@nestjs/common';
import { S3FileService } from './s3-file.service';
import { S3Controller } from './s3.controller';
import { S3DocumentsService } from './s3-documents.service';
import { S3WorkLogPhotosService } from './s3-work-log-photo.service';

@Module({
  controllers: [S3Controller],
  providers: [S3FileService, S3DocumentsService, S3WorkLogPhotosService],
  exports: [S3FileService, S3DocumentsService, S3WorkLogPhotosService],
})
export class S3Module {}
