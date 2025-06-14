import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { TransferDto } from './dto/transfer.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { handlePrismaError } from 'src/libs/common/utils/prisma-error.util';
import { DeviceHistoryService } from 'src/device-history/device-history.service';

@Injectable()
export class DeviceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly historyService: DeviceHistoryService,
  ) {}

  private async accessObject(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { object: true },
    });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const device = await this.prisma.device.findUnique({ where: { id } });
    if (!device) throw new NotFoundException('Устройство не найдено');

    if (user.role === 'FOREMAN' && user.object?.id !== device?.objectId)
      throw new ForbiddenException('Недостаточно прав для этого объекта');

    return { user, device };
  }

  async create(dto: CreateDto) {
    try {
      return await this.prisma.device.create({
        data: {
          name: dto.name,
          serialNumber: dto.serialNumber,
          status: dto.status ?? 'ON_OBJECT',
          objectId: dto.objectId,
        },
        include: { storage: true },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Устройство с таким серийным номером уже существует',
        defaultMessage: 'Ошибка создания устройства',
      });
    }
  }

  async getAll() {
    return this.prisma.device.findMany({ include: { storage: true } });
  }

  async getById(id: string) {
    const device = await this.prisma.device.findUnique({
      where: { id },
      include: { storage: true },
    });
    if (!device) throw new NotFoundException('Устройство не найдено');
    return device;
  }

  async update(id: string, dto: UpdateDto) {
    try {
      return await this.prisma.device.update({
        where: { id },
        data: {
          name: dto.name,
          serialNumber: dto.serialNumber,
          status: dto.status ?? 'ON_OBJECT',
          objectId: dto.objectId,
        },
        include: { storage: true },
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Устройство не найдено',
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось обновить устройство',
      });
    }
  }

  async changeStatus(id: string, userId: string, dto: UpdateStatusDto) {
    const { device } = await this.accessObject(id, userId);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const updated = await tx.device.update({
          where: { id },
          data: { status: dto.newStatus },
          include: { storage: true },
        });

        await tx.deviceStatusHistory.create({
          data: {
            deviceId: id,
            userId,
            fromStatus: device.status,
            toStatus: dto.newStatus,
            comment: dto.comment,
          },
        });

        return updated;
      });
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось изменить статус устройства',
      });
    }
  }

  async transfer(id: string, dto: TransferDto, userId: string) {
    await this.accessObject(id, userId);
    const device = await this.getById(id);

    if (device.objectId === dto.objectId)
      throw new ConflictException('Нельзя перемещать на тот же объект');

    try {
      return await this.prisma.$transaction(async (tx) => {
        const transferred = await tx.device.update({
          where: { id },
          data: {
            objectId: dto.objectId,
            status: 'IN_TRANSIT',
          },
          include: { storage: true },
        });

        const history = await this.historyService.create({
          userId,
          deviceId: id,
          fromObjectId: device.objectId,
          toObjectId: dto.objectId,
        });

        return { transferred, history };
      });
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось выполнить передачу устройства',
      });
    }
  }

  async confirmTransfer(id: string) {
    try {
      return await this.prisma.device.update({
        where: { id },
        data: { status: 'ON_OBJECT' },
        include: { storage: true },
      });
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось подтвердить передачу устройства',
      });
    }
  }

  async delete(id: string) {
    await this.getById(id);
    try {
      await this.prisma.device.delete({ where: { id } });
      return true;
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось удалить устройство',
      });
    }
  }
}
