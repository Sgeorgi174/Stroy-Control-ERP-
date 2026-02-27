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
import { CreateCommentDto } from './dto/create-request-comment.dto';
import { UpdateCommentDto } from './dto/update-request-comment.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { ClothesRequestStatusService } from './clothes-request-status.service';
import { TransferToStorageDto } from './dto/transfer-to-storage.dto';

@Controller('clothes-request')
export class ClothesRequestController {
  constructor(
    private readonly clothesRequestService: ClothesRequestService,
    private readonly statusService: ClothesRequestStatusService,
  ) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Get('get/:id')
  findOne(@Param('id') id: string, @Authorized() user: User) {
    return this.clothesRequestService.findOne(id, user);
  }

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

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRequestStatusDto,
    @Authorized() user: User,
  ) {
    // Передаем id, новый статус, пользователя и текст комментария (причину)
    return this.statusService.updateStatus(
      id,
      dto.status,
      user,
      dto.text ?? '',
    );
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Get('comments/:requestId')
  getComments(@Param('requestId') requestId: string) {
    return this.clothesRequestService.getCommentsByRequest(requestId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('comments/:requestId')
  addComment(
    @Param('requestId') requestId: string,
    @Body() dto: CreateCommentDto,
    @Authorized() user: User,
  ) {
    return this.clothesRequestService.addComment(requestId, dto.text, user);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Patch('comments/:commentId')
  updateComment(
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
    @Authorized() user: User,
  ) {
    return this.clothesRequestService.updateComment(commentId, dto.text, user);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Delete('comments/:commentId')
  removeComment(
    @Param('commentId') commentId: string,
    @Authorized() user: User,
  ) {
    return this.clothesRequestService.removeComment(commentId, user);
  }

  @Authorization(
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('transfer/:id')
  async transferToStorage(
    @Param('id') requestId: string,
    @Body() dto: TransferToStorageDto,
    @Authorized() user: User,
  ) {
    return this.clothesRequestService.transferToStorage({
      requestId,
      items: dto.items,
      objectId: dto.objectId,
      userId: user.id,
    });
  }
}
