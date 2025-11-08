import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ToolHistoryService } from 'src/tool-history/tool-history.service';
import { TransferDto } from './dto/transfer.dto';
import { handlePrismaError } from '../libs/common/utils/prisma-error.util';
import { UpdateStatusDto } from './dto/update-status.dto';
import { GetToolsQueryDto } from './dto/get-tools-query.dto';
import { buildStatusFilter } from 'src/libs/common/utils/buildStatusFilter';
import { RejectToolTransferDto } from './dto/reject-transfer.dto';
import { RetransferToolDto } from './dto/retransfer.dto';
import { WriteOffToolInTransferDto } from './dto/write-off-in-transit.dto';
import { CancelToolTransferDto } from './dto/cancel-transfer.dto';
import { AddBagItemDto } from './dto/add-bag-item.dto';
import { BagItem } from 'generated/prisma';
import { RemoveBagItemDto } from './dto/remove-bag-item';
import { AddToolCommentDto } from './dto/add-tool-comment.dto';
import { AddQuantityToolDto } from './dto/add-quantity-tool.dto';
import { WriteOffQuantityDto } from './dto/write-off-quantity-tool.dto';

@Injectable()
export class ToolService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly toolHistoryService: ToolHistoryService,
  ) {}

  private async accessObject(id: string, userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { object: true },
    });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const tool = await this.prismaService.tool.findUnique({ where: { id } });

    if (!tool) throw new NotFoundException('Инструмент не найден');

    if (user.role === 'FOREMAN' && user.object?.id !== tool?.objectId)
      throw new ForbiddenException('Недостаточно прав для этого объекта');

    return { user, tool };
  }

  public async create(dto: CreateDto) {
    try {
      return await this.prismaService.tool.create({
        data: {
          name: dto.name,
          serialNumber: dto.serialNumber ? dto.serialNumber : undefined,
          objectId: dto.objectId,
          isBulk: dto.isBulk,
          quantity: dto.quantity ? dto.quantity : undefined,
          description: dto.description ?? undefined,
        },
        include: { storage: true },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Инструмент с таким серийным номером уже существует',
        defaultMessage: 'Ошибка создания инструмента',
      });
    }
  }

  public async addQuantity(
    toolId: string,
    userId: string,
    dto: AddQuantityToolDto,
  ) {
    const tool = await this.getById(toolId);

    if (!tool.isBulk)
      throw new BadRequestException(
        'Добавление количества возможно только для пакетных инструментов',
      );

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const updatedTool = await prisma.tool.update({
          where: { id: toolId },
          data: { quantity: { increment: dto.quantity } },
          include: { storage: true },
        });

        await this.toolHistoryService.create({
          action: 'ADD',
          toolId,
          userId,
          fromObjectId: tool.objectId ?? undefined,
          toObjectId: tool.objectId!,
          quantity: dto.quantity,
        });

        return updatedTool;
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Инструмент не найден',
        defaultMessage: 'Не удалось добавить инструмент',
      });
    }
  }

  public async writeOffQuantity(
    toolId: string,
    userId: string,
    dto: WriteOffQuantityDto,
  ) {
    const tool = await this.getById(toolId);

    if (!tool.isBulk)
      throw new BadRequestException(
        'Списание количества возможно только для пакетных инструментов',
      );

    if (dto.quantity > tool.quantity)
      throw new BadRequestException(
        'Нельзя списать больше, чем имеется на складе',
      );

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const updatedTool = await prisma.tool.update({
          where: { id: toolId },
          data: { quantity: { decrement: dto.quantity } },
          include: { storage: true },
        });

        await this.toolHistoryService.create({
          action: 'WRITTEN_OFF',
          toolId,
          userId,
          fromObjectId: tool.objectId ?? undefined,
          toObjectId: tool.objectId!,
          comment: dto.comment,
          quantity: dto.quantity,
        });

        return updatedTool;
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Инструмент не найден',
        defaultMessage: 'Не удалось списать инструмент',
      });
    }
  }

  public async createBag(dto: CreateDto) {
    try {
      return await this.prismaService.tool.create({
        data: {
          name: dto.name,
          serialNumber: dto.serialNumber,
          objectId: dto.objectId,
          isBag: true,
        },
        include: { storage: true },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Инструмент с таким серийным номером уже существует',
        defaultMessage: 'Ошибка создания инструмента',
      });
    }
  }

  public async addBagItem(toolId: string, dto: AddBagItemDto) {
    const tool = await this.getById(toolId);
    if (!tool.isBag) {
      throw new BadRequestException('Инструмент не является сумкой');
    }
    const existingItem: BagItem | undefined = tool.bagItems.find(
      (item) => item.name === dto.name,
    );
    if (existingItem) {
      return this.prismaService.bagItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + dto.quantity },
      });
    }
    return this.prismaService.bagItem.create({
      data: { toolId, name: dto.name, quantity: dto.quantity },
    });
  }

  public async removeBagItem(itemId: string, dto: RemoveBagItemDto) {
    const item = await this.prismaService.bagItem.findUnique({
      where: { id: itemId },
    });

    if (!item)
      throw new BadRequestException('Такой инструмент в сумке не найден');

    if (dto.quantity > item.quantity)
      throw new BadRequestException('Неккоректное удаляемое количество');

    if (dto.quantity === item.quantity) {
      return this.prismaService.bagItem.delete({ where: { id: itemId } });
    }

    return this.prismaService.bagItem.update({
      where: { id: itemId },
      data: { quantity: { decrement: dto.quantity } },
    });
  }

  public async getById(id: string) {
    const tool = await this.prismaService.tool.findUnique({
      where: { id },
      include: { storage: true, bagItems: true },
    });

    if (!tool) throw new NotFoundException('Инструмент не найден');

    return tool;
  }

  public async getTransferById(id: string) {
    const transfer = await this.prismaService.pendingTransfersTools.findUnique({
      where: { id },
      include: { tool: true },
    });

    if (!transfer) throw new NotFoundException('Перемещение не найдено');

    return transfer;
  }

  public async getFiltered(query: GetToolsQueryDto) {
    const statusFilter = buildStatusFilter(query.status);
    const tools = await this.prismaService.tool.findMany({
      where: {
        ...(query.objectId === 'all' ? {} : { objectId: query.objectId }),
        ...(query.isBulk === 'true' ? { isBulk: true } : { isBulk: false }),
        ...statusFilter,
        ...(query.searchQuery
          ? {
              OR: [
                {
                  serialNumber: {
                    contains: query.searchQuery,
                    mode: 'insensitive',
                  },
                },
                { name: { contains: query.searchQuery, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        bagItems: true,
        storage: {
          select: {
            foreman: {
              select: { firstName: true, lastName: true, phone: true },
            },
            name: true,
            address: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return tools;
  }

  public async update(id: string, dto: UpdateDto) {
    try {
      return await this.prismaService.tool.update({
        where: { id },
        data: {
          name: dto.name,
          status: dto.status ?? 'ON_OBJECT',
          serialNumber: dto.serialNumber,
          objectId: dto.objectId,
          description: dto.description ?? undefined,
          quantity: dto.quantity ?? undefined,
        },
        include: { storage: true },
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Инструмент не найден',
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось обновить инструмент',
      });
    }
  }

  public async changeStatus(id: string, userId: string, dto: UpdateStatusDto) {
    const tool = await this.getById(id);

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const updatedTool = await prisma.tool.update({
          where: { id },
          data: {
            status: dto.status,
            objectId:
              dto.status === 'LOST' || dto.status === 'WRITTEN_OFF'
                ? null
                : tool.objectId,
          },
          include: { storage: true },
        });

        await prisma.toolStatusHistory.create({
          data: {
            toolId: tool.id,
            userId,
            fromStatus: tool.status,
            toStatus: dto.status,
            comment: dto.comment,
          },
        });

        return updatedTool;
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Инструмент не найден',
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось изменить статус инструмента',
      });
    }
  }

  public async transfer(id: string, dto: TransferDto, userId: string) {
    // await this.accessObject(id, userId);
    const tool = await this.getById(id);

    if (tool.objectId === dto.objectId)
      throw new ConflictException('Нельзя перемещать на тот же объект');

    if (tool.status !== 'ON_OBJECT')
      throw new ConflictException(
        'Нельзя перемещать инструмент, который, не на объекте',
      );

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const transferredTool = await prisma.tool.update({
          where: { id },
          data: {
            status: 'IN_TRANSIT',
          },
          include: { storage: true },
        });

        await prisma.pendingTransfersTools.create({
          data: {
            status: 'IN_TRANSIT',
            fromObjectId: tool.objectId ? tool.objectId : null,
            toObjectId: dto.objectId,
            toolId: tool.id,
          },
        });

        const recordHistory = await this.toolHistoryService.create({
          userId,
          toolId: id,
          fromObjectId: tool.objectId ? tool.objectId : undefined,
          toObjectId: dto.objectId,
          action: 'TRANSFER',
        });

        return { transferredTool, recordHistory };
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Инструмент не найден',
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось выполнить передачу инструмента',
      });
    }
  }

  public async confirmTransfer(recordId: string, userId: string) {
    const transfer = await this.getTransferById(recordId);

    if (transfer.status !== 'IN_TRANSIT') {
      throw new ConflictException('Перемещение уже завершено');
    }

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const updatedTool = await prisma.tool.update({
          where: { id: transfer.toolId },
          data: {
            objectId: transfer?.toObjectId,
            status: 'ON_OBJECT',
          },
          include: { storage: true },
        });

        const transferRecord = await this.toolHistoryService.create({
          action: 'CONFIRM',
          userId,
          fromObjectId: transfer.fromObjectId
            ? transfer.fromObjectId
            : undefined,
          toObjectId: transfer.toObjectId,
          toolId: transfer.toolId,
        });

        await prisma.pendingTransfersTools.update({
          where: { id: recordId },
          data: { status: 'CONFIRM' },
        });

        return { updatedTool, transferRecord };
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Инструмент не найден',
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось подтвердить передачу',
      });
    }
  }

  public async rejectTransfer(
    recordId: string,
    userId: string,
    dto: RejectToolTransferDto,
  ) {
    const transfer = await this.getTransferById(recordId);

    if (transfer.status !== 'IN_TRANSIT') {
      throw new ConflictException('Перемещение уже завершено');
    }
    try {
      return this.prismaService.$transaction(async (prisma) => {
        const updatedPendingTransfer =
          await prisma.pendingTransfersTools.update({
            where: { id: recordId },
            data: { status: 'REJECT', rejectionComment: dto.rejectionComment },
          });

        const tranferRecord = await this.toolHistoryService.create({
          action: 'REJECT',
          fromObjectId: updatedPendingTransfer.fromObjectId
            ? updatedPendingTransfer.fromObjectId
            : undefined,
          toObjectId: updatedPendingTransfer.toObjectId,
          toolId: updatedPendingTransfer.toolId,
          userId,
        });

        return { updatedPendingTransfer, tranferRecord };
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Запись не найдена',
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось отклонить передачу',
      });
    }
  }

  public async reTransfer(
    recordId: string,
    dto: RetransferToolDto,
    userId: string,
  ) {
    const transfer = await this.getTransferById(recordId);

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.pendingTransfersTools.update({
          where: { id: recordId },
          data: { rejectMode: 'RESEND' },
        });

        await this.toolHistoryService.create({
          userId,
          toolId: transfer.tool.id,
          fromObjectId: transfer.fromObjectId
            ? transfer.fromObjectId
            : undefined,
          toObjectId: dto.toObjectId,
          action: 'TRANSFER',
        });

        return await prisma.pendingTransfersTools.create({
          data: {
            fromObjectId: transfer.fromObjectId,
            toObjectId: dto.toObjectId,
            status: 'IN_TRANSIT',
            toolId: transfer.toolId,
          },
        });
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Запись не найдена',
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось создать новое перемещение',
      });
    }
  }

  public async returnToSource(recordId: string, userId: string) {
    const transfer = await this.getTransferById(recordId);

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.pendingTransfersTools.update({
          where: { id: recordId },
          data: { rejectMode: 'RETURN_TO_SOURCE' },
        });

        await this.toolHistoryService.create({
          userId,
          toolId: transfer.tool.id,
          fromObjectId: transfer.toObjectId,
          toObjectId: transfer.fromObjectId as string,
          action: 'RETURN_TO_SOURCE',
        });

        return await prisma.pendingTransfersTools.create({
          data: {
            fromObjectId: transfer.toObjectId,
            toObjectId: transfer.fromObjectId as string,
            status: 'IN_TRANSIT',
            toolId: transfer.toolId,
            rejectMode: 'RETURN_TO_SOURCE',
            rejectionComment: transfer.rejectionComment,
            photoUrl: transfer.photoUrl,
          },
        });
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Запись не найдена',
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось создать новое перемещение',
      });
    }
  }

  public async writeOffInTransfer(
    recordId: string,
    userId: string,
    dto: WriteOffToolInTransferDto,
  ) {
    const transfer = await this.getTransferById(recordId);

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.pendingTransfersTools.update({
          where: { id: recordId },
          data: { rejectMode: 'WRITE_OFF' },
        });

        await this.changeStatus(transfer.toolId, userId, {
          comment: dto.comment,
          status: dto.status,
        });
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Запись не найдена',
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось списать указанный инвентарь',
      });
    }
  }

  public async cancelTransfer(
    recordId: string,
    userId: string,
    dto: CancelToolTransferDto,
  ) {
    const transfer = await this.getTransferById(recordId);
    if (transfer.status !== 'IN_TRANSIT') {
      throw new ConflictException('Нельзя отменить завершённое перемещение');
    }
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.tool.update({
          where: { id: transfer.toolId },
          data: {
            objectId: transfer.fromObjectId,
            status: 'ON_OBJECT',
          },
        });

        await this.toolHistoryService.create({
          userId,
          toolId: transfer.tool.id,
          fromObjectId: transfer.fromObjectId as string,
          toObjectId: transfer.toObjectId,
          action: 'CANCEL',
        });

        return await prisma.pendingTransfersTools.update({
          where: { id: recordId },
          data: { status: 'CANCEL', rejectionComment: dto.rejectionComment },
        });
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Запись не найдена',
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось отменить перемещение',
      });
    }
  }

  public async addComment(toolId: string, dto: AddToolCommentDto) {
    await this.getById(toolId);
    try {
      return await this.prismaService.tool.update({
        where: { id: toolId },
        data: { comment: dto.comment },
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Инструмент не найден',
        defaultMessage: 'Не удалось добавить коментарий',
      });
    }
  }

  public async updateComment(toolId: string, dto: AddToolCommentDto) {
    await this.getById(toolId);
    try {
      return await this.prismaService.tool.update({
        where: { id: toolId },
        data: { comment: dto.comment },
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Инструмент не найден',
        defaultMessage: 'Не удалось обновить коментарий',
      });
    }
  }

  public async deleteComment(toolId: string) {
    await this.getById(toolId);
    try {
      return await this.prismaService.tool.update({
        where: { id: toolId },
        data: { comment: '' },
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Инструмент не найден',
        defaultMessage: 'Не удалось удалить коментарий',
      });
    }
  }

  public async delete(id: string) {
    await this.getById(id);

    try {
      await this.prismaService.tool.delete({ where: { id } });
      return true;
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Инструмент не найден',
        defaultMessage: 'Не удалось удалить инструмент',
      });
    }
  }
}
