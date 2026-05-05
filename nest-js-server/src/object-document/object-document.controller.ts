import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '@prisma/client';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { CreateObjectDocumentDto } from './dto/object-document.dto';
import { ObjectDocumentService } from './object-document.service';

@Controller('object-documents')
export class ObjectDocumentController {
  constructor(private readonly documentService: ObjectDocumentService) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Authorized('id') userId: string,
    @Body() dto: CreateObjectDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('tut');

    return this.documentService.create(userId, dto, file);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('object/:objectId')
  findAll(
    @Param('objectId') objectId: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    return this.documentService.findAll(objectId, type, search);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateObjectDocumentDto>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentService.update(id, dto, file);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(id);
  }
}
