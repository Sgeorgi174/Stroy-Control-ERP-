import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSentItemDto } from './dto/create-sent-item.dto';
import { UpdateSentItemDto } from './dto/update-sent-item.dto';
import { ChangeSentItemQuantityDto } from './dto/change-sent-quantity.dto';
import { SentItemHistoryType } from '@prisma/client';

@Injectable()
export class SentItemsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSentItemDto) {
    return this.prisma.$transaction(async (pr) => {
      const item = await pr.sentItems.create({
        data: {
          addedDay: dto.addedDay,
          desсription: dto.description,
          name: dto.name,
          price: dto.price,
          quantity: dto.quantity,
          additionalStorageId: dto.additionalStorageId,
        },
      });

      await pr.sentItemHistory.create({
        data: {
          type: 'CREATE',
          quantity: dto.quantity,
          comment: 'Создана новая позиция',
          actionDate: new Date(dto.addedDay),
          sentItemId: item.id, // здесь нельзя сразу, поэтому чуть ниже покажу решение
        },
      });

      return item;
    });
  }

  findAll() {
    return this.prisma.sentItems.findMany({
      include: {
        storage: true,
        history: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, dto: UpdateSentItemDto) {
    const item = await this.prisma.sentItems.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');

    return this.prisma.sentItems.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const item = await this.prisma.sentItems.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');

    return this.prisma.sentItems.delete({
      where: { id },
    });
  }

  // ➕ Пополнение
  async addQuantity(id: string, dto: ChangeSentItemQuantityDto) {
    return this.changeQuantity(id, dto, 'ADD');
  }

  // ➖ Списание
  async removeQuantity(id: string, dto: ChangeSentItemQuantityDto) {
    return this.changeQuantity(id, dto, 'REMOVE');
  }

  // 🔒 Общая логика
  private async changeQuantity(
    id: string,
    dto: ChangeSentItemQuantityDto,
    type: SentItemHistoryType,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.sentItems.findUnique({ where: { id } });
      if (!item) throw new NotFoundException('Item not found');

      if (type === 'REMOVE' && item.quantity < dto.quantity) {
        throw new BadRequestException('Not enough items in stock');
      }

      await tx.sentItems.update({
        where: { id },
        data: {
          quantity:
            type === 'ADD'
              ? { increment: dto.quantity }
              : { decrement: dto.quantity },
        },
      });

      await tx.sentItemHistory.create({
        data: {
          type,
          actionDate: dto.actionDate,
          quantity: dto.quantity,
          comment: dto.comment,
          sentItemId: id,
        },
      });

      return { success: true };
    });
  }

  async getHistory(sentItemId: string) {
    const item = await this.prisma.sentItems.findUnique({
      where: { id: sentItemId },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return this.prisma.sentItemHistory.findMany({
      where: {
        sentItemId,
      },
      orderBy: {
        actionDate: 'asc',
      },
    });
  }
}
