import { Module } from '@nestjs/common';
import { S3FileService } from './s3-file.service';
import { S3Controller } from './s3.controller';
import { S3DocumentsService } from './s3-documents.service';

@Module({
  controllers: [S3Controller],
  providers: [S3FileService, S3DocumentsService],
  exports: [S3FileService, S3DocumentsService],
})
export class S3Module {}
