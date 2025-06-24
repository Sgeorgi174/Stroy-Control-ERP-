import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { handlePrismaError } from 'src/libs/common/utils/prisma-error.util';
import { GetObjectQueryDto } from './dto/get-object-query.dto';
import { ChangeForemanDto } from './dto/changeForeman.dto';

@Injectable()
export class ObjectService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: CreateDto) {
    try {
      return await this.prismaService.object.create({
        data: {
          name: dto.name,
          address: dto.address,
          userId: dto.userId ?? null,
        },
        include: { tools: true, employees: true, clothes: true, devices: true },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Объект с таким названием и адресом уже существует',
        defaultMessage: 'Ошибка создания нового объекта',
      });
    }
  }

  public async getFiltered(query: GetObjectQueryDto) {
    const objects = await this.prismaService.object.findMany({
      where: {
        ...(query.status ? { status: query.status } : {}),
        ...(query.searchQuery
          ? {
              OR: [
                {
                  name: {
                    contains: query.searchQuery,
                    mode: 'insensitive',
                  },
                },
                {
                  address: { contains: query.searchQuery, mode: 'insensitive' },
                },
              ],
            }
          : {}),
      },
      include: {
        foreman: {
          select: { firstName: true, lastName: true, phone: true, id: true },
        },
        employees: { select: { _count: true } },
      },
      orderBy: { name: 'asc' },
    });

    return objects;
  }

  public async getById(id: string) {
    try {
      const object = await this.prismaService.object.findUnique({
        where: { id },
        include: { tools: true, employees: true, clothes: true, devices: true },
      });

      if (!object) throw new NotFoundException('Объект не найден');

      return object;
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Ошибка получения объекта по ID',
      });
    }
  }

  public async getByUserId(userId: string) {
    try {
      const object = await this.prismaService.object.findUnique({
        where: { userId },
        include: { tools: true, employees: true, clothes: true, devices: true },
      });

      if (!object)
        throw new NotFoundException('У указанного пользователя нет объектов');

      return object;
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Ошибка получения объекта по userId',
      });
    }
  }

  public async update(id: string, dto: UpdateDto) {
    await this.getById(id);

    try {
      return await this.prismaService.object.update({
        where: { id },
        data: {
          name: dto.name,
          address: dto.address,
          userId: dto.userId ?? null,
        },
        include: { tools: true, employees: true, clothes: true, devices: true },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Обновление нарушает уникальность объекта',
        defaultMessage: 'Ошибка при обновлении объекта',
      });
    }
  }

  public async changeForeman(objectId: string, dto: ChangeForemanDto) {
    await this.getById(objectId);

    try {
      return await this.prismaService.object.update({
        where: { id: objectId },
        data: { userId: dto.userId ? dto.userId : null },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Обновление нарушает уникальность объекта',
        defaultMessage: 'Ошибка при обновлении объекта',
      });
    }
  }

  public async removeForeman(objectId: string) {
    await this.getById(objectId);

    try {
      return await this.prismaService.object.update({
        where: { id: objectId },
        data: { userId: null },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Обновление нарушает уникальность объекта',
        defaultMessage: 'Ошибка при обновлении объекта',
      });
    }
  }

  public async delete(id: string) {
    const object = await this.getById(id);

    const errors: string[] = [];

    if (object.employees.length > 0) {
      errors.push(`Сотрудники (${object.employees.length})`);
    }

    if (object.tools.length > 0) {
      errors.push(`Инструмент (${object.tools.length})`);
    }

    if (object.clothes.length > 0) {
      errors.push(`Одежда (${object.clothes.length})`);
    }

    if (object.devices.length > 0) {
      errors.push(`Техника (${object.clothes.length})`);
    }

    if (errors.length > 0) {
      throw new BadRequestException(
        `Нельзя удалить объект: с ним связаны следующие элементы: ${errors.join(
          ', ',
        )}. Пожалуйста, сначала переместите или удалите их.`,
      );
    }

    try {
      await this.prismaService.object.delete({ where: { id } });
      return true;
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Ошибка удаления объекта',
      });
    }
  }
}
