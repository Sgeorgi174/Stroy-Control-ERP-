import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTabletDto } from './dto/create.dto';
import { UpdateTabletDto } from './dto/update.dto';
import { TransferTabletDto } from './dto/transfer.dto';
import { UpdateTabletStatusDto } from './dto/update-status.dto';
import { TabletHistoryService } from 'src/tablet-history/tablet-history.service';
import { handlePrismaError } from 'src/libs/common/utils/prisma-error.util';

@Injectable()
export class TabletService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tabletHistoryService: TabletHistoryService,
  ) {}

  async create(dto: CreateTabletDto) {
    try {
      return await this.prismaService.tablet.create({ data: dto });
    } catch (err) {
      handlePrismaError(err, {
        conflictMessage: 'Планшет с таким серийным номером уже существует',
        defaultMessage: 'Ошибка создания планшета',
      });
    }
  }

  async getAll() {
    return this.prismaService.tablet.findMany({ include: { employee: true } });
  }

  async getById(id: string) {
    const tablet = await this.prismaService.tablet.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!tablet) throw new NotFoundException('Планшет не найден');
    return tablet;
  }

  async update(id: string, dto: UpdateTabletDto) {
    try {
      return await this.prismaService.tablet.update({
        where: { id },
        data: dto,
        include: { employee: true },
      });
    } catch (err) {
      handlePrismaError(err, {
        notFoundMessage: 'Планшет не найден',
        defaultMessage: 'Ошибка обновления планшета',
      });
    }
  }

  async changeStatus(id: string, userId: string, dto: UpdateTabletStatusDto) {
    const tablet = await this.getById(id);
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const updated = await prisma.tablet.update({
          where: { id },
          data: { status: dto.newStatus },
          include: { employee: true },
        });

        await this.tabletHistoryService.create(
          {
            tabletId: tablet.id,
            fromStatus: tablet.status,
            toStatus: dto.newStatus,
          },
          userId,
        );

        return updated;
      });
    } catch (err) {
      handlePrismaError(err);
    }
  }

  async transfer(id: string, dto: TransferTabletDto, userId: string) {
    const tablet = await this.getById(id);

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const transferred = await prisma.tablet.update({
          where: { id },
          data: {
            employeeId: dto.employeeId,
            status: 'ACTIVE',
          },
          include: { employee: true },
        });

        await this.tabletHistoryService.create(
          {
            tabletId: id,
            fromEmployeeId: tablet.employeeId ? tablet.employeeId : undefined,
            toEmployeeId: dto.employeeId,
            comment: 'Передача планшета',
          },
          userId,
        );

        return transferred;
      });
    } catch (err) {
      handlePrismaError(err);
    }
  }

  async release(id: string, userId: string) {
    const tablet = await this.getById(id);

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const released = await prisma.tablet.update({
          where: { id },
          data: {
            employeeId: null,
            status: 'INACTIVE',
          },
          include: { employee: true },
        });

        await this.tabletHistoryService.create(
          {
            tabletId: id,
            fromEmployeeId: tablet.employeeId || undefined,
            toEmployeeId: undefined,
            fromStatus: tablet.status,
            toStatus: 'INACTIVE',
            comment: 'Освобождение планшета',
          },
          userId,
        );

        return released;
      });
    } catch (err) {
      handlePrismaError(err);
    }
  }

  async delete(id: string) {
    await this.getById(id);
    try {
      await this.prismaService.tablet.delete({ where: { id } });
      return true;
    } catch (err) {
      handlePrismaError(err);
    }
  }
}
