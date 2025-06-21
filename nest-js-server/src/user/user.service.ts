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

        const unconfirmedClothes = await prisma.clothes.findMany({
          where: {
            objectId: object.id,
            inTransit: {
              gt: 0,
            },
          },
          include: { storage: { include: { foreman: true } } },
        });

        return { unconfirmedClothes, unconfirmedDevices, unconfirmedTools };
      });
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось получить уведомления',
      });
    }
  }
}
