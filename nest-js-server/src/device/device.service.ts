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
import { GetDeviceQueryDto } from './dto/get-device-query.dto';
import { buildStatusFilter } from 'src/libs/common/utils/buildStatusFilter';
import { RejectDeviceTransferDto } from './dto/reject-transfer.dto';
import { RetransferDeviceDto } from './dto/retransfer.dto';
import { WriteOffDeviceInTransferDto } from './dto/write-off-in-transit.dto';
import { CancelDeviceTransferDto } from './dto/cancel-transfer.dto';
import { Roles } from 'generated/prisma';

@Injectable()
export class DeviceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly historyService: DeviceHistoryService,
  ) {}

  private async accessObject(id: string, userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { object: true },
    });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const device = await this.prismaService.device.findUnique({
      where: { id },
    });
    if (!device) throw new NotFoundException('Устройство не найдено');

    if (user.role === 'FOREMAN' && user.object?.id !== device?.objectId)
      throw new ForbiddenException('Недостаточно прав для этого объекта');

    return { user, device };
  }

  async create(dto: CreateDto, userRole: Roles) {
    const object = await this.prismaService.object.findUnique({
      where: { id: dto.objectId },
    });
    if (userRole !== 'ACCOUNTANT' && object?.name === 'Главный склад')
      throw new ForbiddenException('У вас нет доступа к этому складу');
    try {
      return await this.prismaService.device.create({
        data: {
          name: dto.name,
          serialNumber: dto.serialNumber,
          status: dto.status ?? 'ON_OBJECT',
          objectId: dto.objectId,
          originalSerial: dto.originalSerial ?? undefined,
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
    return this.prismaService.device.findMany({ include: { storage: true } });
  }

  async getById(id: string) {
    const device = await this.prismaService.device.findUnique({
      where: { id },
      include: { storage: true },
    });
    if (!device) throw new NotFoundException('Устройство не найдено');
    return device;
  }

  public async getTransferById(id: string) {
    const transfer =
      await this.prismaService.pendingTransfersDevices.findUnique({
        where: { id },
        include: { device: true },
      });

    if (!transfer) throw new NotFoundException('Перемещение не найдено');

    return transfer;
  }

  public async getFiltered(query: GetDeviceQueryDto) {
    const statusFilter = buildStatusFilter(query.status);
    const devices = await this.prismaService.device.findMany({
      where: {
        ...(query.objectId === 'all' ? {} : { objectId: query.objectId }),
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

    return devices;
  }

  async update(id: string, dto: UpdateDto) {
    try {
      return await this.prismaService.device.update({
        where: { id },
        data: {
          name: dto.name,
          serialNumber: dto.serialNumber,
          status: dto.status ?? 'ON_OBJECT',
          objectId: dto.objectId,
          originalSerial: dto.originalSerial ?? undefined,
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
    const device = await this.getById(id);

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const updated = await prisma.device.update({
          where: { id },
          data: {
            status: dto.status,
            objectId:
              dto.status === 'LOST' || dto.status === 'WRITTEN_OFF'
                ? null
                : device.objectId,
          },
          include: { storage: true },
        });

        await prisma.deviceStatusHistory.create({
          data: {
            deviceId: id,
            userId,
            fromStatus: device.status,
            toStatus: dto.status,
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
    // await this.accessObject(id, userId);
    const device = await this.getById(id);

    if (device.objectId === dto.objectId)
      throw new ConflictException('Нельзя перемещать на тот же объект');

    if (device.status !== 'ON_OBJECT')
      throw new ConflictException(
        'Нельзя перемещать технику, которая, не на объекте',
      );

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const transferredDevice = await prisma.device.update({
          where: { id },
          data: {
            status: 'IN_TRANSIT',
          },
          include: { storage: true },
        });

        await prisma.pendingTransfersDevices.create({
          data: {
            status: 'IN_TRANSIT',
            fromObjectId: device.objectId ? device.objectId : undefined,
            toObjectId: dto.objectId,
            deviceId: device.id,
          },
        });

        const history = await this.historyService.create({
          userId,
          deviceId: id,
          fromObjectId: device.objectId ? device.objectId : undefined,
          toObjectId: dto.objectId,
          action: 'TRANSFER',
        });

        return { transferredDevice, history };
      });
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось выполнить передачу устройства',
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
        const updatedDevice = await prisma.device.update({
          where: { id: transfer.deviceId },
          data: {
            objectId: transfer.toObjectId,
            status: 'ON_OBJECT',
          },
          include: { storage: true },
        });

        const transferRecord = await this.historyService.create({
          action: 'CONFIRM',
          userId,
          fromObjectId: transfer.fromObjectId
            ? transfer.fromObjectId
            : undefined,
          toObjectId: transfer.toObjectId,
          deviceId: transfer.deviceId,
        });

        await prisma.pendingTransfersDevices.update({
          where: { id: recordId },
          data: { status: 'CONFIRM' },
        });

        return { updatedDevice, transferRecord };
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Техника не найдена',
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось подтвердить передачу',
      });
    }
  }

  public async rejectTransfer(
    recordId: string,
    userId: string,
    dto: RejectDeviceTransferDto,
  ) {
    const transfer = await this.getTransferById(recordId);

    if (transfer.status !== 'IN_TRANSIT') {
      throw new ConflictException('Перемещение уже завершено');
    }
    try {
      return this.prismaService.$transaction(async (prisma) => {
        const updatedPendingTransfer =
          await prisma.pendingTransfersDevices.update({
            where: { id: recordId },
            data: { status: 'REJECT', rejectionComment: dto.rejectionComment },
          });

        const tranferRecord = await this.historyService.create({
          action: 'REJECT',
          fromObjectId: updatedPendingTransfer.fromObjectId
            ? updatedPendingTransfer.fromObjectId
            : undefined,
          toObjectId: updatedPendingTransfer.toObjectId,
          deviceId: updatedPendingTransfer.deviceId,
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
    dto: RetransferDeviceDto,
    userId: string,
  ) {
    const transfer = await this.getTransferById(recordId);

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.pendingTransfersDevices.update({
          where: { id: recordId },
          data: { rejectMode: 'RESEND' },
        });

        await this.historyService.create({
          userId,
          deviceId: transfer.device.id,
          fromObjectId: transfer.fromObjectId
            ? transfer.fromObjectId
            : undefined,
          toObjectId: dto.toObjectId,
          action: 'TRANSFER',
        });

        return await prisma.pendingTransfersDevices.create({
          data: {
            fromObjectId: transfer.fromObjectId,
            toObjectId: dto.toObjectId,
            status: 'IN_TRANSIT',
            deviceId: transfer.deviceId,
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
        await prisma.pendingTransfersDevices.update({
          where: { id: recordId },
          data: { rejectMode: 'RETURN_TO_SOURCE' },
        });

        await this.historyService.create({
          userId,
          deviceId: transfer.deviceId,
          fromObjectId: transfer.toObjectId,
          toObjectId: transfer.fromObjectId as string,
          action: 'RETURN_TO_SOURCE',
        });

        return await prisma.pendingTransfersDevices.create({
          data: {
            fromObjectId: transfer.toObjectId,
            toObjectId: transfer.fromObjectId as string,
            status: 'IN_TRANSIT',
            deviceId: transfer.deviceId,
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
    dto: WriteOffDeviceInTransferDto,
  ) {
    const transfer = await this.getTransferById(recordId);

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.pendingTransfersDevices.update({
          where: { id: recordId },
          data: { rejectMode: 'WRITE_OFF' },
        });

        await this.changeStatus(transfer.deviceId, userId, {
          comment: dto.comment,
          status: dto.status,
        });
      });
    } catch (error) {
      console.log(error);

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
    dto: CancelDeviceTransferDto,
  ) {
    const transfer = await this.getTransferById(recordId);
    if (transfer.status !== 'IN_TRANSIT') {
      throw new ConflictException('Нельзя отменить завершённое перемещение');
    }
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.device.update({
          where: { id: transfer.deviceId },
          data: {
            objectId: transfer.fromObjectId,
            status: 'ON_OBJECT',
          },
        });

        await this.historyService.create({
          userId,
          deviceId: transfer.deviceId,
          fromObjectId: transfer.fromObjectId as string,
          toObjectId: transfer.toObjectId,
          action: 'CANCEL',
        });

        return await prisma.pendingTransfersDevices.update({
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

  async delete(id: string) {
    await this.getById(id);
    try {
      await this.prismaService.device.delete({ where: { id } });
      return true;
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось удалить устройство',
      });
    }
  }
}
