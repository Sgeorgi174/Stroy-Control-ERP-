import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClothesRequestService } from './clothes-request.service';
import { CreateClothesRequestDto } from './dto/create-clothes-request.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles, User } from '@prisma/client';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { UpdateClothesRequestDto } from './dto/update-clothes-request.dto';

@Controller('clothes-request')
export class ClothesRequestController {
  constructor(private readonly clothesRequestService: ClothesRequestService) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('create')
  create(@Body() dto: CreateClothesRequestDto, @Authorized() user: User) {
    return this.clothesRequestService.create(dto, user.id);
  }

  // 🔹 Получить все доступные заявки
  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Get('all')
  findAll(@Authorized() user: User) {
    return this.clothesRequestService.findAll(user);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateClothesRequestDto) {
    return this.clothesRequestService.update(id, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.clothesRequestService.remove(id);
  }
}
