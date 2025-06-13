import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { TransferDto } from './dto/transfer.dto';
import { ConfirmDto } from './dto/confirm.dto';
import { ClothesHistoryService } from 'src/clothes-history/clothes-history.service';
import { handlePrismaError } from '../libs/common/utils/prisma-error.util';

@Injectable()
export class ClothesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clothesHistoryService: ClothesHistoryService,
  ) {}

  async create(dto: CreateDto) {
    try {
      return await this.prismaService.clothes.create({
        data: {
          name: dto.name,
          size: dto.size,
          price: dto.price,
          quantity: dto.quantity,
          inTransit: dto.inTransit,
          objectId: dto.objectId,
          type: dto.type,
          season: dto.season,
        },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Одежда с таким набором параметров уже существует',
        defaultMessage: 'Ошибка создания новой одежды',
      });
    }
  }

  async getById(id: string) {
    try {
      return await this.prismaService.clothes.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Одежда не найдена',
      });
    }
  }

  async getAll() {
    return await this.prismaService.clothes.findMany({
      include: { storage: true },
    });
  }

  async update(id: string, dto: UpdateDto) {
    try {
      await this.getById(id); // чтобы вызвать NotFound заранее

      return await this.prismaService.clothes.update({
        where: { id },
        data: {
          name: dto.name,
          size: dto.size,
          price: dto.price,
          quantity: dto.quantity,
          inTransit: dto.inTransit,
          objectId: dto.objectId,
          type: dto.type,
          season: dto.season,
        },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Обновление нарушает уникальность данных',
        notFoundMessage: 'Одежда для обновления не найдена',
        defaultMessage: 'Ошибка обновления одежды',
      });
    }
  }

  async transfer(id: string, dto: TransferDto, userId: string) {
    const clothes = await this.getById(id);

    if (dto.quantity <= 0) {
      throw new BadRequestException(
        'Количество для перемещения должно быть положительным',
      );
    }

    if (clothes.quantity < dto.quantity) {
      throw new BadRequestException(
        'Недостаточное количество одежды для перемещения',
      );
    }

    if (clothes.objectId === dto.toObjectId) {
      throw new BadRequestException('Нельзя перемещать в тот же объект');
    }

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const updatedSource = await prisma.clothes.update({
          where: { id },
          data: { quantity: { decrement: dto.quantity } },
        });

        const targetClothes = await prisma.clothes.upsert({
          where: {
            objectId_name_size_type_season: {
              objectId: dto.toObjectId,
              name: clothes.name,
              size: clothes.size,
              type: clothes.type,
              season: clothes.season,
            },
          },
          create: {
            objectId: dto.toObjectId,
            name: clothes.name,
            size: clothes.size,
            type: clothes.type,
            season: clothes.season,
            price: clothes.price,
            quantity: 0,
            inTransit: dto.quantity,
          },
          update: {
            inTransit: { increment: dto.quantity },
          },
        });

        const recordHistory = await this.clothesHistoryService.create({
          userId,
          clothesId: clothes.id,
          fromObjectId: clothes.objectId,
          toObjectId: dto.toObjectId,
          quantity: dto.quantity,
        });

        return {
          source: { id: updatedSource.id, quantity: updatedSource.quantity },
          target: targetClothes,
          createdHistory: recordHistory,
        };
      });
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Ошибка при перемещении одежды',
      });
    }
  }

  async confirmTransfer(id: string, dto: ConfirmDto) {
    const clothes = await this.getById(id);

    if (dto.quantity <= 0) {
      throw new BadRequestException(
        'Количество подтверждения должно быть положительным',
      );
    }

    if (clothes.inTransit < dto.quantity) {
      throw new BadRequestException('Недостаточное количество одежды в пути');
    }

    try {
      await this.prismaService.clothes.update({
        where: { id },
        data: {
          inTransit: { decrement: dto.quantity },
          quantity: { increment: dto.quantity },
        },
      });

      return { success: true };
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось подтвердить перемещение одежды',
      });
    }
  }

  async delete(id: string) {
    try {
      await this.prismaService.clothes.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Одежда для удаления не найдена',
        defaultMessage: 'Ошибка при удалении одежды',
      });
    }
  }
}
