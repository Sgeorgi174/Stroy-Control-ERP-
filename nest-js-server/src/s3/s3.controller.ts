import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3FileService } from './s3-file.service';
import { UploadFileDto } from './dto/upload-file.dto';

@Controller('upload')
export class S3Controller {
  constructor(private readonly s3Service: S3FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
  ) {
    return this.s3Service.uploadImage(file, dto);
  }
}
