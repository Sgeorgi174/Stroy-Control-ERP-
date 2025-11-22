import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransferType } from 'generated/prisma';
import { handlePrismaError } from 'src/libs/common/utils/prisma-error.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryTransfersFilterDto } from './dto/query-transfer-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: CreateUserDto) {
    const isExist = await this.prismaService.user.findUnique({
      where: { phone: dto.phone },
    });

    if (isExist)
      throw new ConflictException(
        'Пользователь с таким номером уже существует',
      );

    return await this.prismaService.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role,
      },
    });
  }

  public async update(id: string, dto: UpdateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
    });

    if (!user) throw new NotFoundException('Юзер не найден');

    return await this.prismaService.user.update({
      where: { id: id },
      data: {
        phone: dto.phone,
        lastName: dto.lastName,
        firstName: dto.firstName,
        role: dto.role,
      },
    });
  }

  public async getAllUsers() {
    return this.prismaService.user.findMany();
  }

  public async deleteUser(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
    });

    if (!user) throw new NotFoundException('Юзер не найден');

    return this.prismaService.user.delete({ where: { id: id } });
  }

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
            OR: [
              { rejectMode: null },
              { rejectMode: { not: 'RETURN_TO_SOURCE' } },
            ],
          },
          include: {
            tool: {
              select: {
                name: true,
                id: true,
                serialNumber: true,
                isBulk: true,
                quantity: true,
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
                id: true,
                clothingHeight: true,
                clothingSize: true,
                footwearSize: true,
                createdAt: true,
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
      where: {
        OR: [
          { role: 'FOREMAN', object: null },
          { role: 'ACCOUNTANT', object: null },
          { role: 'ASSISTANT_MANAGER', object: null },
          { role: 'MASTER', object: null },
          { role: 'ADMIN', object: null },
        ],
      },
      orderBy: { lastName: 'asc' },
    });

    return foremen;
  }

  public async getStatusObject(userId: string) {
    try {
      const object = await this.prismaService.object.findUnique({
        where: { userId, isPending: true },
        include: {
          clothes: {
            select: {
              id: true,
              name: true,
              quantity: true,
              type: true,
              season: true,
              clothingSize: true,
              clothingHeight: true,
              footwearSize: true,
            },
          },
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

  public async getReturns(userId: string) {
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
            rejectMode: 'RETURN_TO_SOURCE',
          },
          include: {
            tool: {
              select: {
                name: true,
                id: true,
                serialNumber: true,
                isBulk: true,
                quantity: true,
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

        const devices = await prisma.pendingTransfersDevices.findMany({
          where: {
            toObjectId: object.id,
            status: 'IN_TRANSIT',
            rejectMode: 'RETURN_TO_SOURCE',
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
            rejectMode: 'RETURN_TO_SOURCE',
          },
          include: {
            clothes: {
              select: {
                name: true,
                season: true,
                type: true,
                clothingHeight: true,
                clothingSize: true,
                footwearSize: true,
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

  public async getAllTransfers(filters: QueryTransfersFilterDto) {
    try {
      const { status, fromObjectId, toObjectId, updatedAt } = filters;

      const whereCommon = {
        ...(status && { status }),
        ...(fromObjectId && { fromObjectId }),
        ...(toObjectId && { toObjectId }),
        ...(updatedAt && {
          updatedAt: {
            gte: new Date(updatedAt),
            lt: new Date(new Date(updatedAt).getTime() + 24 * 60 * 60 * 1000),
          },
        }),
      };

      return await this.prismaService.$transaction(async (prisma) => {
        const toolTransfers = await prisma.pendingTransfersTools.findMany({
          where: whereCommon,
          select: {
            tool: {
              select: {
                id: true,
                name: true,
                serialNumber: true,
                isBulk: true,
                quantity: true,
              },
            },
            status: true,
            id: true,
            createdAt: true,
            updatedAt: true,
            fromObjectId: true,
            toObjectId: true,
            photoUrl: true,
            rejectionComment: true,
            toolId: true,
            rejectMode: true,
            quantity: true,
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
          where: whereCommon,
          select: {
            device: { select: { id: true, name: true, serialNumber: true } },
            status: true,
            id: true,
            fromObjectId: true,
            toObjectId: true,
            photoUrl: true,
            rejectionComment: true,
            deviceId: true,
            rejectMode: true,
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
          where: whereCommon,
          select: {
            clothes: {
              select: {
                id: true,
                name: true,
                clothingHeight: true,
                clothingSize: true,
                footwearSize: true,
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
            rejectMode: true,
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
