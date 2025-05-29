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
export class ObjectService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: CreateDto) {
    try {
      return await this.prismaService.object.create({
        data: {
          name: dto.name,
          address: dto.address,
          userId: dto.userId ?? null,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ConflictException(
          'Объект с таким названием и адресом уже существует',
        );

      throw new InternalServerErrorException('Ошибка создания нового объекта');
    }
  }

  public async getAll() {
    return await this.prismaService.object.findMany({
      include: { tools: true, employees: true, clothes: true },
    });
  }

  public async getById(id: string) {
    const object = await this.prismaService.object.findUnique({
      where: { id },
      include: { tools: true, employees: true, clothes: true },
    });

    if (!object) throw new NotFoundException('Объект не найден');

    return object;
  }

  public async getByUserId(userId: string) {
    const object = await this.prismaService.object.findUnique({
      where: { userId },
      include: { tools: true, employees: true, clothes: true },
    });

    if (!object)
      throw new NotFoundException('У указанного Юзера, нет объектов');

    return object;
  }

  public async update(id: string, dto: UpdateDto) {
    await this.getById(id);

    const updatedObject = await this.prismaService.object.update({
      where: { id },
      data: {
        name: dto.name,
        address: dto.address,
        userId: dto.userId ?? null,
      },
      include: { tools: true, employees: true, clothes: true },
    });

    return updatedObject;
  }

  public async delete(id: string) {
    await this.getById(id);

    await this.prismaService.object.delete({ where: { id } });

    return true;
  }
}
