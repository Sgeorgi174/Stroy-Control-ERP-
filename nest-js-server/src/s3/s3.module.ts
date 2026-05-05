import { Module } from '@nestjs/common';
import { S3FileService } from './s3-file.service';
import { S3Controller } from './s3.controller';
import { S3DocumentsService } from './s3-documents.service';
import { S3WorkLogPhotosService } from './s3-work-log-photo.service';
import { S3MaterialPhotosService } from './s3-material-photo.service';
import { S3ObjectDocumentsService } from './s3-object-doc.service';

@Module({
  controllers: [S3Controller],
  providers: [
    S3FileService,
    S3DocumentsService,
    S3WorkLogPhotosService,
    S3MaterialPhotosService,
    S3ObjectDocumentsService,
  ],
  exports: [
    S3FileService,
    S3DocumentsService,
    S3WorkLogPhotosService,
    S3MaterialPhotosService,
    S3ObjectDocumentsService,
  ],
})
export class S3Module {}
