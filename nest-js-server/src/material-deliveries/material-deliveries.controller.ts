import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '@prisma/client';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import {
  CreateMaterialDeliveryDto,
  UpdateMaterialDeliveryDto,
} from './dto/material-deliveries.dto';
import { MaterialDeliveryService } from './material-deliveries.service';

@Controller('material-deliveries')
export class MaterialDeliveryController {
  constructor(private readonly deliveryService: MaterialDeliveryService) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Post('create')
  @UseInterceptors(FilesInterceptor('photos', 10)) // Лимит 10 для материалов
  create(
    @Authorized('id') userId: string,
    @Body() dto: CreateMaterialDeliveryDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.deliveryService.create(userId, dto, files);
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
  getArchive(
    @Param('objectId') objectId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.deliveryService.findAllByMonth(objectId, +year, +month);
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
  @UseInterceptors(FilesInterceptor('photos', 10))
  update(
    @Param('id') id: string,
    @Authorized('id') userId: string,
    @Body() dto: UpdateMaterialDeliveryDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.deliveryService.update(id, userId, dto, files);
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
    return this.deliveryService.remove(id);
  }
}
