import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';

@Injectable()
export class ToolHistoryService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: CreateDto) {
    try {
      return await this.prismaService.toolHistory.create({
        data: {
          userId: dto.userId,
          toolId: dto.toolId,
          fromObjectId: dto.fromObjectId,
          toObjectId: dto.toObjectId,
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
        'Ошибка создания записи перемещения инструмента',
      );
    }
  }

  public async getByToolId(toolId: string) {
    try {
      return await this.prismaService.toolHistory.findMany({
        where: { toolId },
        include: {
          fromObject: { select: { name: true } },
          toObject: { select: { name: true } },
          movedBy: { select: { firstName: true, lastName: true } },
        },
      });
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'Ошибка получения записей перемещения инструмента',
      );
    }
  }

  public async delete(historyId: string) {
    try {
      return await this.prismaService.toolHistory.delete({
        where: { id: historyId },
      });
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'Ошибка удаления записи перемещения инструмента',
      );
    }
  }
}
