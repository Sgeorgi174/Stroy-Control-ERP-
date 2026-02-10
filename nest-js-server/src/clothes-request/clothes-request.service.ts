import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClothesRequestDto } from './dto/create-clothes-request.dto';
import { UpdateClothesRequestDto } from './dto/update-clothes-request.dto';
import { RequestStatus, Roles, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClothesRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: User) {
    // 👑 Админ видит всё
    if (user.role === Roles.ADMIN) {
      return this.prisma.clothesRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          clothes: true,
          createdBy: true,
          participants: true,
          notifyUsers: true,
        },
      });
    }

    // 👤 Обычный пользователь
    return this.prisma.clothesRequest.findMany({
      where: {
        OR: [
          // создатель заявки
          {
            userId: user.id,
          },
          // участник заявки
          {
            participants: {
              some: {
                id: user.id,
              },
            },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        clothes: true,
        createdBy: true,
        participants: true,
        notifyUsers: true,
      },
    });
  }

  // 🔹 Создание заявки
  async create(dto: CreateClothesRequestDto, userId: string) {
    return this.prisma.clothesRequest.create({
      data: {
        title: dto.title,
        customer: dto.customer,
        status: dto.status ?? RequestStatus.PENDING,

        createdBy: {
          connect: { id: userId },
        },

        participants: dto.participantsIds
          ? {
              connect: dto.participantsIds.map((id) => ({ id })),
            }
          : undefined,

        notifyUsers: dto.notifyUsersIds
          ? {
              connect: dto.notifyUsersIds.map((id) => ({ id })),
            }
          : undefined,

        clothes: dto.clothes
          ? {
              create: {
                type: dto.clothes.type,
                season: dto.clothes.season,
                name: dto.clothes.name,
                quantity: dto.clothes.quantity,

                clothingSizeId: dto.clothes.clothingSizeId,
                clothingHeightId: dto.clothes.clothingHeightId,
                footwearSizeId: dto.clothes.footwearSizeId,
              },
            }
          : undefined,
      },
      include: {
        clothes: true,
        participants: true,
        notifyUsers: true,
      },
    });
  }

  // 🔹 Обновление заявки
  async update(id: string, dto: UpdateClothesRequestDto) {
    const request = await this.prisma.clothesRequest.findUnique({
      where: { id },
      include: { clothes: true },
    });

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    return this.prisma.clothesRequest.update({
      where: { id },
      data: {
        title: dto.title,
        customer: dto.customer,
        status: dto.status,

        participants: dto.participantsIds
          ? {
              set: dto.participantsIds.map((id) => ({ id })),
            }
          : undefined,

        notifyUsers: dto.notifyUsersIds
          ? {
              set: dto.notifyUsersIds.map((id) => ({ id })),
            }
          : undefined,

        clothes: dto.clothes
          ? request.clothes
            ? {
                update: {
                  type: dto.clothes.type,
                  season: dto.clothes.season,
                  name: dto.clothes.name,
                  quantity: dto.clothes.quantity,
                  clothingSizeId: dto.clothes.clothingSizeId,
                  clothingHeightId: dto.clothes.clothingHeightId,
                  footwearSizeId: dto.clothes.footwearSizeId,
                },
              }
            : {
                create: {
                  ...dto.clothes,
                },
              }
          : undefined,
      },
      include: {
        clothes: true,
        participants: true,
        notifyUsers: true,
      },
    });
  }

  // 🔹 Удаление заявки
  async remove(id: string) {
    const request = await this.prisma.clothesRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    return this.prisma.clothesRequest.delete({
      where: { id },
    });
  }
}
