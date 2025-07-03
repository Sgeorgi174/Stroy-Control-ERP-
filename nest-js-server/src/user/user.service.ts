import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
        where: { id: userId, role: 'FOREMAN' },
        include: { object: true },
      });

      if (!user) {
        throw new BadRequestException('Вы не являетесь бригадиром');
      }

      const object = user?.object;

      if (!object) {
        throw new NotFoundException('Вы не назначены ни на один объект');
      }

      return await this.prismaService.$transaction(async (prisma) => {
        const unconfirmedTools = await prisma.tool.findMany({
          where: { objectId: object.id, status: 'IN_TRANSIT' },
          include: { storage: { include: { foreman: true } } },
        });

        const unconfirmedDevices = await prisma.device.findMany({
          where: { objectId: object.id, status: 'IN_TRANSIT' },
          include: { storage: { include: { foreman: true } } },
        });

        const unconfirmedClothes =
          await prisma.pendingTransfersClothes.findMany({
            where: {
              toObjectId: object.id,
            },
            include: {
              clothes: {
                select: { name: true, season: true, type: true, size: true },
              },
              toObject: {
                select: {
                  foreman: { select: { firstName: true, lastName: true } },
                  name: true,
                },
              },
            },
          });

        return { unconfirmedClothes, unconfirmedDevices, unconfirmedTools };
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

  public async getAllTransfers() {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const toolTransfers = await prisma.pendingTransfersTools.findMany({
          select: {
            tool: { select: { id: true, name: true, serialNumber: true } },
            status: true,
            id: true,
            createdAt: true,
            fromObjectId: true,
            toObjectId: true,
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
            deviceId: true,
            createdAt: true,
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
            quantity: true,
            fromObjectId: true,
            toObjectId: true,
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
}
