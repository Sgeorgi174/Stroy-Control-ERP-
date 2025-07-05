import { Injectable, NotFoundException } from '@nestjs/common';
import { TransferType } from 'generated/prisma';
import { handlePrismaError } from 'src/libs/common/utils/prisma-error.util';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create() {}

  public async update() {}

  public async getNotifications(userId: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        include: { object: true },
      });

      const object = user?.object;

      if (!object) {
        throw new NotFoundException('Вы не назначены ни на один объект');
      }

      return await this.prismaService.$transaction(async (prisma) => {
        const tools = await prisma.pendingTransfersTools.findMany({
          where: {
            toObjectId: object.id,
            status: 'IN_TRANSIT',
          },
          include: {
            tool: {
              select: { name: true, id: true, serialNumber: true },
            },
            toObject: {
              select: {
                foreman: {
                  select: { firstName: true, lastName: true, phone: true },
                },
                name: true,
              },
            },
            fromObject: {
              select: {
                foreman: {
                  select: { firstName: true, lastName: true, phone: true },
                },
                name: true,
              },
            },
          },
        });

        const devices = await prisma.pendingTransfersDevices.findMany({
          where: {
            toObjectId: object.id,
            status: 'IN_TRANSIT',
          },
          include: {
            device: {
              select: { name: true, id: true, serialNumber: true },
            },
            toObject: {
              select: {
                foreman: {
                  select: { firstName: true, lastName: true, phone: true },
                },
                name: true,
              },
            },
            fromObject: {
              select: {
                foreman: {
                  select: { firstName: true, lastName: true, phone: true },
                },
                name: true,
              },
            },
          },
        });

        const clothes = await prisma.pendingTransfersClothes.findMany({
          where: {
            toObjectId: object.id,
            status: 'IN_TRANSIT',
          },
          include: {
            clothes: {
              select: {
                name: true,
                season: true,
                type: true,
                size: true,
                id: true,
              },
            },
            toObject: {
              select: {
                foreman: {
                  select: { firstName: true, lastName: true, phone: true },
                },
                name: true,
              },
            },
            fromObject: {
              select: {
                foreman: {
                  select: { firstName: true, lastName: true, phone: true },
                },
                name: true,
              },
            },
          },
        });

        return { clothes, devices, tools };
      });
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось получить уведомления',
      });
    }
  }

  public async getFreeForemen() {
    const foremen = await this.prismaService.user.findMany({
      where: { role: 'FOREMAN', object: null },
      orderBy: { lastName: 'asc' },
    });

    return foremen;
  }

  public async getStatusObject(userId: string) {
    try {
      const object = await this.prismaService.object.findUnique({
        where: { userId, isPending: true },
        include: {
          clothes: true,
          devices: { where: { status: { not: 'IN_TRANSIT' } } },
          employees: true,
          tools: { where: { status: { not: 'IN_TRANSIT' } } },
        },
      });

      if (!object) return undefined;

      return object;
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Ошибка поиска объекта',
        defaultMessage: 'Не удалось получить уведомления',
      });
    }
  }

  public async getAllTransfers() {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const toolTransfers = await prisma.pendingTransfersTools.findMany({
          select: {
            tool: { select: { id: true, name: true, serialNumber: true } },
            status: true,
            id: true,
            createdAt: true,
            updatedAt: true,
            fromObjectId: true,
            toObjectId: true,
            photoUrl: true,
            rejectionComment: true,
            toolId: true,
            fromObject: {
              select: {
                name: true,
                id: true,
                foreman: {
                  select: { lastName: true, firstName: true, phone: true },
                },
                address: true,
              },
            },
            toObject: {
              select: {
                name: true,
                id: true,
                address: true,
                foreman: {
                  select: {
                    firstName: true,
                    lastName: true,
                    phone: true,
                    id: true,
                  },
                },
              },
            },
          },
        });
        const deviceTransfers = await prisma.pendingTransfersDevices.findMany({
          select: {
            device: { select: { id: true, name: true, serialNumber: true } },
            status: true,
            id: true,
            fromObjectId: true,
            toObjectId: true,
            photoUrl: true,
            rejectionComment: true,
            deviceId: true,
            createdAt: true,
            updatedAt: true,
            fromObject: {
              select: {
                name: true,
                id: true,
                foreman: {
                  select: { lastName: true, firstName: true, phone: true },
                },
                address: true,
              },
            },
            toObject: {
              select: {
                name: true,
                id: true,
                address: true,
                foreman: {
                  select: {
                    firstName: true,
                    lastName: true,
                    phone: true,
                    id: true,
                  },
                },
              },
            },
          },
        });
        const clothesTransfers = await prisma.pendingTransfersClothes.findMany({
          select: {
            clothes: {
              select: {
                id: true,
                name: true,
                size: true,
                season: true,
                type: true,
              },
            },
            status: true,
            id: true,
            createdAt: true,
            updatedAt: true,
            quantity: true,
            fromObjectId: true,
            toObjectId: true,
            photoUrl: true,
            rejectionComment: true,
            clothesId: true,
            fromObject: {
              select: {
                name: true,
                id: true,
                foreman: {
                  select: { lastName: true, firstName: true, phone: true },
                },
                address: true,
              },
            },
            toObject: {
              select: {
                name: true,
                id: true,
                address: true,
                foreman: {
                  select: {
                    firstName: true,
                    lastName: true,
                    phone: true,
                    id: true,
                  },
                },
              },
            },
          },
        });

        return {
          tools: toolTransfers,
          devices: deviceTransfers,
          clothes: clothesTransfers,
        };
      });
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось получить уведомления',
      });
    }
  }

  public async setPhotoRequestTransferId(
    phone: string,
    transferId: string,
    type: TransferType,
  ) {
    try {
      const telegramUser = await this.prismaService.telegramUser.update({
        where: { phone },
        data: {
          photoRequestedTransferId: transferId,
          photoRequestedTransferType: type,
        },
      });

      return telegramUser;
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось найти айди перемещения',
      });
    }
  }

  public async clearPhotoRequestTransferId(phone: string) {
    try {
      const telegramUser = await this.prismaService.telegramUser.update({
        where: { phone },
        data: { photoRequestedTransferId: null },
      });

      return telegramUser;
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось найти айди перемещения',
      });
    }
  }

  public async getToolTransferPhoto(transferId: string) {
    try {
      return await this.prismaService.pendingTransfersTools.findUniqueOrThrow({
        where: { id: transferId, photoUrl: { not: null } },
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Фото еще не получено',
        defaultMessage: 'Не удалось найти айди перемещения',
      });
    }
  }

  public async getDeviceTransferPhoto(transferId: string) {
    try {
      return await this.prismaService.pendingTransfersDevices.findUniqueOrThrow(
        {
          where: { id: transferId, photoUrl: { not: null } },
        },
      );
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Фото еще не получено',
        defaultMessage: 'Не удалось найти айди перемещения',
      });
    }
  }

  public async getClothesTransferPhoto(transferId: string) {
    try {
      return await this.prismaService.pendingTransfersClothes.findUniqueOrThrow(
        {
          where: { id: transferId, photoUrl: { not: null } },
        },
      );
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Фото еще не получено',
        defaultMessage: 'Не удалось найти айди перемещения',
      });
    }
  }
}
