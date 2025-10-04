import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { TransferDto } from './dto/transfer.dto';
import { ConfirmDto } from './dto/confirm.dto';
import { ClothesHistoryService } from 'src/clothes-history/clothes-history.service';
import { handlePrismaError } from '../libs/common/utils/prisma-error.util';
import { AddDto } from './dto/add.dto';
import { WriteOffDto } from './dto/write-off.dto';
import { ClothesActions } from 'generated/prisma';
import { GiveClothingDto } from './dto/give-clothing.dto';
import { GetClothesQueryDto } from './dto/get-clothes-query.dto';
import { RejectClothesTransferDto } from './dto/reject-transfer.dto';
import { RetransferClothesDto } from './dto/retransfer.dto';
import { WriteOffClothesInTransferDto } from './dto/write-off-in-transit.dto';
import { CancelClothesTransferDto } from './dto/cancel-transfer.dto';
import { AddSizeForClothingDto } from './dto/add-size-for-clothing.dto';
import { AddSizeForFootwearDto } from './dto/add-size-for-footwear.dto';
import { AddHeightForClothingDto } from './dto/add-height-for-clothing.dto';

@Injectable()
export class ClothesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clothesHistoryService: ClothesHistoryService,
  ) {}

  async addSizeForClothing(dto: AddSizeForClothingDto) {
    try {
      return await this.prismaService.clothingSize.create({
        data: {
          size: dto.size,
        },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Такой размер уже существует',
        defaultMessage: 'Ошибка создания нового размера',
      });
    }
  }

  async removeSizeForClothing(sizeId: string) {
    try {
      await this.prismaService.clothingSize.delete({
        where: { id: sizeId },
      });
      return true;
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Размер для удаления не найден',
        defaultMessage: 'Ошибка при удалении размера',
      });
    }
  }

  async addSizeForFootwear(dto: AddSizeForFootwearDto) {
    try {
      return await this.prismaService.footwearSize.create({
        data: {
          size: dto.size,
        },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Такой размер уже существует',
        defaultMessage: 'Ошибка создания нового размера',
      });
    }
  }

  async removeSizeForFootwear(sizeId: string) {
    try {
      await this.prismaService.footwearSize.delete({
        where: { id: sizeId },
      });
      return true;
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Размер для удаления не найден',
        defaultMessage: 'Ошибка при удалении размера',
      });
    }
  }

  async addHeightForClothing(dto: AddHeightForClothingDto) {
    try {
      return await this.prismaService.clothingHeight.create({
        data: {
          height: dto.height,
        },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Такая ростовка уже существует',
        defaultMessage: 'Ошибка создания новой ростовки',
      });
    }
  }

  async removeHeightForClothing(sizeId: string) {
    try {
      await this.prismaService.clothingHeight.delete({
        where: { id: sizeId },
      });
      return true;
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Ростовка для удаления не найдена',
        defaultMessage: 'Ошибка при удалении ростовки',
      });
    }
  }

  async create(dto: CreateDto) {
    try {
      return await this.prismaService.clothes.create({
        data: {
          name: dto.name,
          closthingSizeId: dto.closthingSizeId,
          providerId: dto.providerId,
          closthingHeightId: dto.closthingHeightId,
          footwearSizeId: dto.footwearSizeId,
          price: dto.price,
          quantity: dto.quantity,
          objectId: dto.objectId,
          type: dto.type,
          season: dto.season,
        },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Одежда с таким набором параметров уже существует',
        defaultMessage: 'Ошибка создания новой одежды',
      });
    }
  }

  async getById(id: string) {
    try {
      return await this.prismaService.clothes.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Одежда не найдена',
      });
    }
  }

  public async getTransferById(id: string) {
    const transfer =
      await this.prismaService.pendingTransfersClothes.findUnique({
        where: { id },
        include: { clothes: true },
      });

    if (!transfer) throw new NotFoundException('Перемещение не найдено');

    return transfer;
  }

  public async getFiltered(query: GetClothesQueryDto) {
    const clothes = await this.prismaService.clothes.findMany({
      where: {
        ...(query.type ? { type: query.type } : {}),
        ...(query.objectId === 'all' ? {} : { objectId: query.objectId }),
        ...(query.season ? { season: query.season } : {}),
        ...(Number(query.size) ? { size: Number(query.size) } : {}),
      },
      include: {
        inTransit: {
          where: {
            OR: [
              { status: 'IN_TRANSIT' },
              { status: 'REJECT', rejectMode: null },
            ],
          },
        },
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
      orderBy: { storage: { name: 'asc' } },
    });

    return clothes;
  }

  async update(id: string, dto: UpdateDto) {
    try {
      await this.getById(id); // чтобы вызвать NotFound заранее

      return await this.prismaService.clothes.update({
        where: { id },
        data: {
          name: dto.name,
          closthingSizeId: dto.closthingSizeId,
          providerId: dto.providerId,
          closthingHeightId: dto.closthingHeightId,
          footwearSizeId: dto.footwearSizeId,
          price: dto.price,
          quantity: dto.quantity,
          objectId: dto.objectId,
          type: dto.type,
          season: dto.season,
        },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Обновление нарушает уникальность данных',
        notFoundMessage: 'Одежда для обновления не найдена',
        defaultMessage: 'Ошибка обновления одежды',
      });
    }
  }

  async transfer(id: string, dto: TransferDto, userId: string) {
    const clothes = await this.getById(id);

    if (dto.quantity <= 0) {
      throw new BadRequestException(
        'Количество для перемещения должно быть положительным',
      );
    }

    if (clothes.quantity < dto.quantity) {
      throw new BadRequestException(
        'Недостаточное количество одежды для перемещения',
      );
    }

    if (clothes.objectId === dto.toObjectId) {
      throw new BadRequestException('Нельзя перемещать в тот же объект');
    }

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const updatedSource = await prisma.clothes.update({
          where: { id },
          data: { quantity: { decrement: dto.quantity } },
        });

        const createdTransfer = await prisma.pendingTransfersClothes.create({
          data: {
            fromObjectId: clothes.objectId,
            toObjectId: dto.toObjectId,
            clothesId: id,
            quantity: dto.quantity,
            status: 'IN_TRANSIT',
          },
        });

        const recordHistory = await this.clothesHistoryService.create({
          userId,
          clothesId: clothes.id,
          fromObjectId: clothes.objectId,
          toObjectId: dto.toObjectId,
          quantity: dto.quantity,
          action: 'TRANSFER',
        });

        return {
          source: { id: updatedSource.id, quantity: updatedSource.quantity },
          target: createdTransfer,
          createdHistory: recordHistory,
        };
      });
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Ошибка при перемещении одежды',
      });
    }
  }

  async confirmTransfer(id: string, dto: ConfirmDto, userId: string) {
    const transfer =
      await this.prismaService.pendingTransfersClothes.findUnique({
        where: { id },
        include: { clothes: true },
      });

    if (!transfer) {
      throw new NotFoundException('Перемещение не найдено');
    }

    if (dto.quantity <= 0) {
      throw new BadRequestException(
        'Количество подтверждения должно быть положительным',
      );
    }

    if (transfer.quantity < dto.quantity) {
      throw new BadRequestException(
        'Нельзя принять количество, больше чем в перемещении',
      );
    }

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        if (dto.quantity === transfer.quantity) {
          await prisma.pendingTransfersClothes.update({
            where: { id },
            data: { status: 'CONFIRM' },
          });
        } else {
          await prisma.pendingTransfersClothes.update({
            where: { id },
            data: { quantity: { decrement: dto.quantity } },
          });

          await prisma.pendingTransfersClothes.create({
            data: {
              quantity: dto.quantity,
              status: 'CONFIRM',
              clothesId: transfer.clothesId,
              fromObjectId: transfer.fromObjectId,
              toObjectId: transfer.toObjectId,
            },
          });
        }

        const transferedClothes = await this.prismaService.clothes.upsert({
          where: {
            objectId_name_type_season: {
              name: transfer.clothes.name,
              objectId: transfer.toObjectId,
              season: transfer.clothes.season,
              type: transfer.clothes.type,
            },
          },
          create: {
            name: transfer.clothes.name,
            type: transfer.clothes.type,
            season: transfer.clothes.season,
            closthingSizeId: transfer.clothes.closthingSizeId,
            providerId: transfer.clothes.providerId,
            closthingHeightId: transfer.clothes.closthingHeightId,
            footwearSizeId: transfer.clothes.footwearSizeId,
            quantity: transfer.clothes.quantity,
            price: transfer.clothes.price,
            objectId: transfer.toObjectId,
          },
          update: {
            quantity: { increment: dto.quantity },
          },
        });

        // Записываем в историю
        await this.clothesHistoryService.create({
          userId: userId,
          clothesId: transferedClothes.id,
          quantity: dto.quantity,
          action: 'CONFIRM',
          fromObjectId: transfer.fromObjectId,
          toObjectId: transfer.toObjectId,
        });

        return {
          success: true,
        };
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось подтвердить перемещение одежды',
      });
    }
  }

  public async rejectTransfer(recordId: string, dto: RejectClothesTransferDto) {
    try {
      return this.prismaService.$transaction(async (prisma) => {
        const updatedPendingTransfer =
          await prisma.pendingTransfersClothes.update({
            where: { id: recordId },
            data: { status: 'REJECT', rejectionComment: dto.rejectionComment },
          });

        return updatedPendingTransfer;
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
    dto: RetransferClothesDto,
    userId: string,
  ) {
    const transfer = await this.getTransferById(recordId);

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.pendingTransfersClothes.update({
          where: { id: recordId },
          data: { rejectMode: 'RESEND' },
        });

        await this.clothesHistoryService.create({
          userId,
          clothesId: transfer.clothesId,
          fromObjectId: transfer.fromObjectId
            ? transfer.fromObjectId
            : undefined,
          toObjectId: dto.toObjectId,
          action: 'TRANSFER',
          quantity: transfer.quantity,
        });

        return await prisma.pendingTransfersClothes.create({
          data: {
            fromObjectId: transfer.fromObjectId,
            toObjectId: dto.toObjectId,
            status: 'IN_TRANSIT',
            clothesId: transfer.clothesId,
            quantity: transfer.quantity,
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
        await prisma.pendingTransfersClothes.update({
          where: { id: recordId },
          data: { rejectMode: 'RETURN_TO_SOURCE' },
        });

        await this.clothesHistoryService.create({
          userId,
          clothesId: transfer.clothesId,
          fromObjectId: transfer.toObjectId,
          toObjectId: transfer.fromObjectId,
          action: 'RETURN_TO_SOURCE',
          quantity: transfer.quantity,
        });

        return await prisma.pendingTransfersClothes.create({
          data: {
            fromObjectId: transfer.toObjectId,
            toObjectId: transfer.fromObjectId,
            status: 'IN_TRANSIT',
            clothesId: transfer.clothesId,
            rejectMode: 'RETURN_TO_SOURCE',
            rejectionComment: transfer.rejectionComment,
            photoUrl: transfer.photoUrl,
            quantity: transfer.quantity,
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
    dto: WriteOffClothesInTransferDto,
  ) {
    const transfer = await this.getTransferById(recordId);

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.pendingTransfersClothes.update({
          where: { id: recordId },
          data: { rejectMode: 'WRITE_OFF' },
        });

        await this.clothesHistoryService.create({
          userId: userId,
          clothesId: transfer.clothesId,
          quantity: transfer.quantity,
          action: ClothesActions.WRITTEN_OFF,
          writeOffComment: dto.comment,
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
    dto: CancelClothesTransferDto,
  ) {
    const transfer = await this.getTransferById(recordId);
    if (transfer.status !== 'IN_TRANSIT') {
      throw new ConflictException('Нельзя отменить завершённое перемещение');
    }
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.clothes.update({
          where: { id: transfer.clothesId },
          data: {
            quantity: { increment: transfer.quantity },
          },
        });

        await this.clothesHistoryService.create({
          userId,
          clothesId: transfer.clothesId,
          fromObjectId: transfer.fromObjectId,
          toObjectId: transfer.toObjectId,
          action: 'CANCEL',
          quantity: transfer.quantity,
        });

        return await prisma.pendingTransfersClothes.update({
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

  async addClothes(id: string, dto: AddDto, userId: string) {
    await this.getById(id); // если id не найден — вылетит ошибка внутри getById с этим же хелпером

    try {
      const updated = await this.prismaService.clothes.update({
        where: { id },
        data: {
          quantity: { increment: dto.quantity },
        },
      });

      await this.clothesHistoryService.create({
        userId: userId,
        clothesId: id,
        quantity: dto.quantity,
        action: ClothesActions.ADD,
      });

      return updated;
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось пополнить одежду',
      });
    }
  }

  async writeOffClothes(id: string, dto: WriteOffDto, userId: string) {
    const clothes = await this.getById(id);

    if (clothes.quantity < dto.quantity) {
      throw new BadRequestException(
        'Недостаточное количество одежды для списания',
      );
    }

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const updated = await prisma.clothes.update({
          where: { id },
          data: {
            quantity: { decrement: dto.quantity },
          },
        });

        await this.clothesHistoryService.create({
          userId: userId,
          clothesId: id,
          quantity: dto.quantity,
          action: ClothesActions.WRITTEN_OFF,
          writeOffComment: dto.writeOffComment,
        });

        return updated;
      });
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Не удалось списать одежду',
      });
    }
  }

  async giveToEmployee(
    clothingId: string,
    dto: GiveClothingDto,
    userId: string,
  ) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const clothing = await prisma.clothes.findUnique({
          where: { id: clothingId },
        });

        if (!clothing) {
          throw new NotFoundException('Одежда не найдена');
        }

        if (clothing.quantity < 1) {
          throw new ConflictException('Недостаточно одежды на складе');
        }

        // Уменьшаем количество на складе
        const updated = await prisma.clothes.update({
          where: { id: clothingId },
          data: {
            quantity: { decrement: 1 },
          },
        });

        // Создаём запись выдачи сотруднику
        await prisma.employeeClothing.create({
          data: {
            clothingId,
            employeeId: dto.employeeId,
            priceWhenIssued: clothing.price,
            debtAmount: clothing.price,
          },
        });

        // Логируем в историю
        await prisma.clothesHistory.create({
          data: {
            clothesId: clothingId,
            userId: userId,
            quantity: 1,
            action: 'GIVE_TO_EMPLOYEE',
            employeeId: dto.employeeId,
            fromObjectId: clothing.objectId,
          },
        });

        return updated;
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Одежда не найдена',
        conflictMessage: 'Ошибка при выдаче одежды',
        defaultMessage: 'Не удалось выдать одежду сотруднику',
      });
    }
  }

  async delete(id: string) {
    try {
      await this.prismaService.clothes.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Одежда для удаления не найдена',
        defaultMessage: 'Ошибка при удалении одежды',
      });
    }
  }
}
