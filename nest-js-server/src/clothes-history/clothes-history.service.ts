import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { handlePrismaError } from '../libs/common/utils/prisma-error.util';

@Injectable()
export class ClothesHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: CreateDto) {
    try {
      return await this.prismaService.clothesHistory.create({
        data: dto,
        include: {
          fromObject: { select: { name: true } },
          toObject: { select: { name: true } },
          movedBy: { select: { firstName: true, lastName: true } },
        },
      });
    } catch (error) {
      console.error(error);
      handlePrismaError(error, {
        defaultMessage: 'Ошибка создания записи перемещения одежды',
      });
    }
  }

  public async getByClothesId(clothesId: string) {
    try {
      return await this.prismaService.clothesHistory.findMany({
        where: { clothesId, action: { not: 'RETURN_TO_SOURCE' } },
        include: {
          fromObject: { select: { name: true } },
          toObject: { select: { name: true } },
          movedBy: { select: { firstName: true, lastName: true } },
          toEmployee: { select: { lastName: true, firstName: true } },
        },
        orderBy: { createdAt: 'asc' },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Ошибка получения записей перемещения одежды',
      );
    }
  }

  public async delete(historyId: string) {
    try {
      return await this.prismaService.clothesHistory.delete({
        where: { id: historyId },
      });
    } catch (error) {
      console.error(error);
      handlePrismaError(error, {
        notFoundMessage: 'Запись перемещения одежды не найдена',
        defaultMessage: 'Ошибка удаления записи перемещения одежды',
      });
    }
  }
}
