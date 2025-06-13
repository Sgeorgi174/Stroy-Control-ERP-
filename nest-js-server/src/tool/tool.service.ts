import {
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
          serialNumber: dto.serialNumber,
          objectId: dto.objectId,
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

  public async getById(id: string) {
    const tool = await this.prismaService.tool.findUnique({
      where: { id },
      include: { storage: true },
    });

    if (!tool) throw new NotFoundException('Инструмент не найден');

    return tool;
  }

  public async getAll() {
    return this.prismaService.tool.findMany({ include: { storage: true } });
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

  public async transfer(id: string, dto: TransferDto, userId: string) {
    await this.accessObject(id, userId);
    const tool = await this.getById(id);

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const transferredTool = await prisma.tool.update({
          where: { id },
          data: {
            objectId: dto.objectId,
            status: 'IN_TRANSIT',
          },
          include: { storage: true },
        });

        const recordHistory = await this.toolHistoryService.create({
          userId,
          toolId: id,
          fromObjectId: tool.objectId,
          toObjectId: dto.objectId,
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

  public async confirmTransfer(id: string) {
    try {
      return await this.prismaService.tool.update({
        where: { id },
        data: {
          status: 'ON_OBJECT',
        },
        include: { storage: true },
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Инструмент не найден',
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось подтвердить передачу',
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
