import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { TransferDto } from './dto/transfer.dto';
import { ConfirmDto } from './dto/confirm.dto';
import { ClothesHistoryService } from 'src/clothes-history/clothes-history.service';
import { handlePrismaError } from '../libs/common/utils/prisma-error.util';
import { AddDto } from './dto/add.dto';
import { WriteOffDto } from './dto/write-off.dto';
import { ClothesActions } from 'generated/prisma';
import { GiveClothingDto } from './dto/give-clothing.dto';
import { GetClothesQueryDto } from './dto/get-clothes-query.dto';

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

  public async getFiltered(query: GetClothesQueryDto) {
    const clothes = await this.prismaService.clothes.findMany({
      where: {
        ...(query.type ? { type: query.type } : {}),
        ...(query.objectId ? { objectId: query.objectId } : {}),
        ...(query.season ? { season: query.season } : {}),
        ...(Number(query.size) ? { size: Number(query.size) } : {}),
      },
      include: {
        storage: {
          select: {
            foreman: {
              select: { firstName: true, lastName: true, phone: true },
            },
            name: true,
          },
        },
      },
      orderBy: { size: 'asc' },
    });

    return clothes;
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
          action: 'TRANSFER',
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

  async addClothes(id: string, dto: AddDto, userId: string) {
    const clothes = await this.getById(id); // если id не найден — вылетит ошибка внутри getById с этим же хелпером

    try {
      const updated = await this.prismaService.clothes.update({
        where: { id },
        data: {
          quantity: { increment: dto.quantity },
        },
      });

      await this.clothesHistoryService.create({
        userId: userId,
        clothesId: id,
        fromObjectId: clothes.objectId,
        toObjectId: clothes.objectId,
        quantity: dto.quantity,
        action: ClothesActions.ADD,
      });

      return updated;
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось пополнить одежду',
      });
    }
  }

  async writeOffClothes(id: string, dto: WriteOffDto, userId: string) {
    const clothes = await this.getById(id);

    if (clothes.quantity < dto.quantity) {
      throw new BadRequestException(
        'Недостаточное количество одежды для списания',
      );
    }

    try {
      const updated = await this.prismaService.clothes.update({
        where: { id },
        data: {
          quantity: { decrement: dto.quantity },
        },
      });

      await this.clothesHistoryService.create({
        userId: userId,
        clothesId: id,
        fromObjectId: clothes.objectId,
        toObjectId: clothes.objectId,
        quantity: dto.quantity,
        action: ClothesActions.WRITTEN_OFF,
      });

      return updated;
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось списать одежду',
      });
    }
  }

  async giveToEmployee(
    clothingId: string,
    dto: GiveClothingDto,
    userId: string,
  ) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const clothing = await prisma.clothes.findUnique({
          where: { id: clothingId },
        });

        if (!clothing) {
          throw new NotFoundException('Одежда не найдена');
        }

        if (clothing.quantity < 1) {
          throw new ConflictException('Недостаточно одежды на складе');
        }

        // Уменьшаем количество на складе
        await prisma.clothes.update({
          where: { id: clothingId },
          data: {
            quantity: { decrement: 1 },
          },
        });

        // Создаём запись выдачи сотруднику
        await prisma.employeeClothing.create({
          data: {
            clothingId,
            employeeId: dto.employeeId,
            priceWhenIssued: clothing.price,
            debtAmount: clothing.price,
          },
        });

        // Логируем в историю
        await prisma.clothesHistory.create({
          data: {
            clothesId: clothingId,
            userId: userId,
            quantity: 1,
            action: 'TRANSFER',
            fromObjectId: clothing.objectId,
            toObjectId: clothing.objectId, // остаётся на том же объекте
          },
        });

        return { message: 'Одежда успешно выдана сотруднику' };
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Одежда не найдена',
        conflictMessage: 'Ошибка при выдаче одежды',
        defaultMessage: 'Не удалось выдать одежду сотруднику',
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
