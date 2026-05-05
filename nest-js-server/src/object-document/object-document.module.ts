import { Module } from '@nestjs/common';
import { ObjectDocumentService } from './object-document.service';
import { ObjectDocumentController } from './object-document.controller';
import { S3Module } from 'src/s3/s3.module';

@Module({
  controllers: [ObjectDocumentController],
  providers: [ObjectDocumentService],
  imports: [S3Module],
})
export class ObjectDocumentModule {}
