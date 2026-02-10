import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdditionalStorageDto } from './dto/create-additional-storage.dto';
import { UpdateAdditionalStorageDto } from './dto/update-addtitonal-storage.dto';

@Injectable()
export class AdditionalStorageService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateAdditionalStorageDto) {
    return this.prisma.additionalStorage.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.additionalStorage.findMany({
      include: {
        items: true,
      },
    });
  }

  async update(id: string, dto: UpdateAdditionalStorageDto) {
    const storage = await this.prisma.additionalStorage.findUnique({
      where: { id },
    });
    if (!storage) throw new NotFoundException('Storage not found');

    return this.prisma.additionalStorage.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const storage = await this.prisma.additionalStorage.findUnique({
      where: { id },
    });
    if (!storage) throw new NotFoundException('Storage not found');

    return this.prisma.additionalStorage.delete({
      where: { id },
    });
  }
}
