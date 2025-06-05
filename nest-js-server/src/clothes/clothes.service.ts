import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { UpdateDto } from './dto/update.dto';
import { TransferDto } from './dto/transfer.dto';
import { ConfirmDto } from './dto/confirm.dto';
import { ClothesHistoryService } from 'src/clothes-history/clothes-history.service';

@Injectable()
export class ClothesService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly clothesHostoryService: ClothesHistoryService,
  ) {}

  public async create(dto: CreateDto) {
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
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ConflictException(
          'Инструмент с таким серийным номером уже существует',
        );

      throw new InternalServerErrorException(
        'Ошибка создания нового инструмента',
      );
    }
  }

  public async getById(id: string) {
    const clothes = await this.prismaService.clothes.findUnique({
      where: { id },
    });

    if (!clothes) throw new NotFoundException('Инструмент не найден');

    return clothes;
  }

  public async getAll() {
    return await this.prismaService.clothes.findMany({
      include: { storage: true },
    });
  }

  public async update(id: string, dto: UpdateDto) {
    await this.getById(id);

    const updatedClothes = this.prismaService.clothes.update({
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

    return updatedClothes;
  }

  public async transfer(id: string, dto: TransferDto, userId: string) {
    const clothes = await this.getById(id);

    if (clothes.quantity < dto.quantity) {
      throw new BadRequestException(
        'Недостаточное количество одежды для перемещения',
      );
    }

    if (clothes.objectId === dto.toObjectId)
      throw new BadRequestException('Нельзя перемещать в тот же объект');

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

        const recordHistory = await this.clothesHostoryService.create({
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
      console.log(error);

      throw new InternalServerErrorException('Ошибка при перемещении одежды');
    }
  }

  public async confirmTransfer(id: string, dto: ConfirmDto) {
    const clothes = await this.getById(id);

    if (!clothes) {
      throw new NotFoundException('Одежда на целевом объекте не найдена');
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
      console.log(error);

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Обновление нарушает уникальность данных');
      }

      throw new InternalServerErrorException('Не удалось обновить сотрудника');
    }
  }

  public async delete(id: string) {
    await this.getById(id);

    await this.prismaService.clothes.delete({ where: { id } });

    return true;
  }
}
