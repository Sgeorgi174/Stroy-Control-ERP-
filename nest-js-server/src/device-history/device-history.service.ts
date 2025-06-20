import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { handlePrismaError } from '../libs/common/utils/prisma-error.util';

@Injectable()
export class DeviceHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: CreateDto) {
    try {
      return await this.prismaService.deviceHistory.create({
        data: {
          userId: dto.userId,
          deviceId: dto.deviceId,
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
      handlePrismaError(error, {
        defaultMessage: 'Ошибка создания записи перемещения техники',
      });
    }
  }

  public async getByToolId(deviceId: string) {
    try {
      return await this.prismaService.deviceHistory.findMany({
        where: { deviceId },
        include: {
          fromObject: { select: { name: true } },
          toObject: { select: { name: true } },
          movedBy: { select: { firstName: true, lastName: true } },
        },
      });
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Ошибка получения записей перемещения техники',
      });
    }
  }

  public async delete(historyId: string) {
    try {
      return await this.prismaService.deviceHistory.delete({
        where: { id: historyId },
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Запись перемещения не найдена',
        defaultMessage: 'Ошибка удаления записи перемещения инструмента',
      });
    }
  }
}
