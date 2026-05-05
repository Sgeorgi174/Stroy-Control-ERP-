import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Путь к твоему PrismaService
import { CreateBrandDto } from './dto/tool-brand.dto';

@Injectable()
export class ToolBrandService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBrandDto) {
    const exists = await this.prisma.toolBrand.findUnique({
      where: { name: dto.name },
    });

    if (exists) {
      throw new ConflictException('Бренд с таким названием уже существует');
    }

    return this.prisma.toolBrand.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.toolBrand.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { tools: true }, // Сразу видим, сколько инструментов у бренда
        },
      },
    });
  }

  async findOne(id: string) {
    const brand = await this.prisma.toolBrand.findUnique({
      where: { id },
      include: { tools: true },
    });

    if (!brand) throw new NotFoundException('Бренд не найден');
    return brand;
  }

  async remove(id: string) {
    // Проверяем, есть ли инструменты, привязанные к этому бренду
    const brand = await this.prisma.toolBrand.findUnique({
      where: { id },
      include: { _count: { select: { tools: true } } },
    });

    if (!brand) throw new NotFoundException('Бренд не найден');

    if (brand._count.tools > 0) {
      throw new BadRequestException(
        'Нельзя удалить бренд, так как к нему привязаны инструменты. Сначала измените бренд у инструментов.',
      );
    }

    return this.prisma.toolBrand.delete({
      where: { id },
    });
  }
}
