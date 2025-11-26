import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
} from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { TransferDto } from './dto/transfer.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { GetToolsQueryDto } from './dto/get-tools-query.dto';
import { UserService } from 'src/user/user.service';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';
import { RejectToolTransferDto } from './dto/reject-transfer.dto';
import { RetransferToolDto } from './dto/retransfer.dto';
import { WriteOffToolInTransferDto } from './dto/write-off-in-transit.dto';
import { CancelToolTransferDto } from './dto/cancel-transfer.dto';
import { AddBagItemDto } from './dto/add-bag-item.dto';
import { RemoveBagItemDto } from './dto/remove-bag-item';
import { AddToolCommentDto } from './dto/add-tool-comment.dto';
import { AddQuantityToolDto } from './dto/add-quantity-tool.dto';
import { WriteOffQuantityDto } from './dto/write-off-quantity-tool.dto';
import { Roles } from '@prisma/client';

@Controller('tools')
export class ToolController {
  constructor(
    private readonly toolService: ToolService,
    private readonly userService: UserService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateDto, @Authorized('role') userRole: Roles) {
    return this.toolService.create(dto, userRole);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Patch('/add/:id')
  addQuantity(
    @Param('id') id: string,
    @Body() dto: AddQuantityToolDto,
    @Authorized('id') userId: string,
  ) {
    return this.toolService.addQuantity(id, userId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Patch('/write-off/:id')
  writeOffQuantity(
    @Param('id') id: string,
    @Body() dto: WriteOffQuantityDto,
    @Authorized('id') userId: string,
  ) {
    return this.toolService.writeOffQuantity(id, userId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('create-bag')
  @HttpCode(HttpStatus.CREATED)
  async createBag(@Body() dto: CreateDto, @Authorized('role') userRole: Roles) {
    return this.toolService.createBag(dto, userRole);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Put('add-bag-item/:id')
  async addBagItem(@Param('id') id: string, @Body() dto: AddBagItemDto) {
    return this.toolService.addBagItem(id, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Put('remove-bag-item/:id')
  async removeBagItem(@Param('id') id: string, @Body() dto: RemoveBagItemDto) {
    return this.toolService.removeBagItem(id, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.toolService.getById(id);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('filter')
  async getFiltered(@Query() query: GetToolsQueryDto) {
    return this.toolService.getFiltered(query);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateDto) {
    return this.toolService.update(id, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Put('add-comment/:id')
  async addToolComment(
    @Param('id') id: string,
    @Body() dto: AddToolCommentDto,
  ) {
    return this.toolService.addComment(id, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Put('update-comment/:id')
  async updateToolComment(
    @Param('id') id: string,
    @Body() dto: AddToolCommentDto,
  ) {
    return this.toolService.updateComment(id, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Put('delete-comment/:id')
  async deleteToolComment(@Param('id') id: string) {
    return this.toolService.deleteComment(id);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Patch('status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @Authorized('id') userId: string,
  ) {
    return this.toolService.changeStatus(id, userId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Patch('transfer/:id')
  async transfer(
    @Param('id') id: string,
    @Body() dto: TransferDto,
    @Authorized('id') userId: string,
  ) {
    return this.toolService.transfer(id, dto, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Patch('transfer-bulk/:id')
  async transferBulk(
    @Param('id') id: string,
    @Body() dto: TransferDto,
    @Authorized('id') userId: string,
  ) {
    return this.toolService.transferBulk(id, dto, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Patch('confirm/:id')
  async confirmTransfer(
    @Param('id') id: string,
    @Authorized('id') userId: string,
  ) {
    return this.toolService.confirmTransfer(id, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Patch('confirm-bulk/:id')
  async confirmTransferBulk(
    @Param('id') id: string,
    @Authorized('id') userId: string,
  ) {
    return this.toolService.confirmTransferBulk(id, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Patch('reject/:id')
  async rejectTransfer(
    @Param('id') id: string,
    @Body() dto: RejectToolTransferDto,
    @Authorized('id') userId: string,
  ) {
    return this.toolService.rejectTransfer(id, userId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.toolService.delete(id);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Post('request-photo-transfer/:id')
  async requestPhotoToReject(
    @Param('id') transferId: string,
    @Authorized('phone') phone: string,
  ) {
    await this.userService.setPhotoRequestTransferId(phone, transferId, 'TOOL');
    await this.telegramBotService.sendRequestTransferPhoto(phone);
    return { success: true };
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('retransfer/:id')
  async reTransfer(
    @Param('id') transferId: string,
    @Body() dto: RetransferToolDto,
    @Authorized('id') userId: string,
  ) {
    return this.toolService.reTransfer(transferId, dto, userId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('transfer-return/:id')
  async returnToSource(@Param('id') transferId: string) {
    return this.toolService.returnToSource(transferId);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('transfer-cancel/:id')
  async cancelTransfer(
    @Param('id') transferId: string,
    @Body() dto: CancelToolTransferDto,
    @Authorized('id') userId: string,
  ) {
    return this.toolService.cancelTransfer(transferId, userId, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('transfer-write-off/:id')
  async writeOffInTransfer(
    @Param('id') transferId: string,
    @Body() dto: WriteOffToolInTransferDto,
    @Authorized('id') userId: string,
  ) {
    return this.toolService.writeOffInTransfer(transferId, userId, dto);
  }
}
