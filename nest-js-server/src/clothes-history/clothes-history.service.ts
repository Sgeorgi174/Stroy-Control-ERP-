import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';

@Injectable()
export class ClothesHistoryService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: CreateDto) {
    try {
      return await this.prismaService.clothesHistory.create({
        data: {
          userId: dto.userId,
          clothesId: dto.clothesId,
          fromObjectId: dto.fromObjectId,
          toObjectId: dto.toObjectId,
          quantity: dto.quantity,
        },
        include: {
          fromObject: { select: { name: true } },
          toObject: { select: { name: true } },
          movedBy: { select: { firstName: true, lastName: true } },
        },
      });
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'Ошибка создания записи перемещения одежды',
      );
    }
  }

  public async getByClothesId(clothesId: string) {
    try {
      return await this.prismaService.clothesHistory.findMany({
        where: { clothesId },
        include: {
          fromObject: { select: { name: true } },
          toObject: { select: { name: true } },
          movedBy: { select: { firstName: true, lastName: true } },
        },
      });
    } catch (error) {
      console.log(error);

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
      console.log(error);

      throw new InternalServerErrorException(
        'Ошибка удаления записи перемещения одежды',
      );
    }
  }
}
