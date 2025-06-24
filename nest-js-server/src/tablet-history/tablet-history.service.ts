import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';

@Injectable()
export class TabletHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDto, userId: string) {
    return this.prisma.tabletHistory.create({
      data: {
        tabletId: dto.tabletId,
        userId,
        fromStatus: dto.fromStatus,
        toStatus: dto.toStatus,
        fromEmployeeId: dto.fromEmployeeId,
        toEmployeeId: dto.toEmployeeId,
        comment: dto.comment,
      },
    });
  }

  async getByTabletId(tabletId: string) {
    return this.prisma.tabletHistory.findMany({
      where: { tabletId },
      include: {
        fromEmployee: { select: { firstName: true, lastName: true } },
        toEmployee: { select: { firstName: true, lastName: true } },
        changedBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async delete(id: string) {
    return this.prisma.tabletHistory.delete({ where: { id } });
  }
}
