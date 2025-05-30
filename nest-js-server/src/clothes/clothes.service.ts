import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class ClothesService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: CreateDto) {
    try {
      return await this.prismaService.clothes.create({
        data: {
          name: dto.name,
          size: dto.size,
          price: dto.price,
          quantity: dto.quantity,
          inTransit: dto.inTransit,
          objectId: dto.objectId,
          type: dto.type,
          season: dto.season,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ConflictException(
          'Инструмент с таким серийным номером уже существует',
        );

      throw new InternalServerErrorException(
        'Ошибка создания нового инструмента',
      );
    }
  }

  public async getById(id: string) {
    const clothes = await this.prismaService.clothes.findUnique({
      where: { id },
    });

    if (!clothes) throw new NotFoundException('Инструмент не найден');

    return clothes;
  }

  public async getAll() {
    return await this.prismaService.clothes.findMany();
  }

  public async update(id: string, dto: UpdateDto) {
    await this.getById(id);

    const updatedClothes = this.prismaService.clothes.update({
      where: { id },
      data: {
        name: dto.name,
        size: dto.size,
        price: dto.price,
        quantity: dto.quantity,
        inTransit: dto.inTransit,
        objectId: dto.objectId,
        type: dto.type,
        season: dto.season,
      },
    });

    return updatedClothes;
  }

  public async delete(id: string) {
    await this.getById(id);

    await this.prismaService.clothes.delete({ where: { id } });

    return true;
  }
}
