import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { handlePrismaError } from 'src/libs/common/utils/prisma-error.util';

@Injectable()
export class EmployeeService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: CreateDto) {
    try {
      return await this.prismaService.employee.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          fatherName: dto.fatherName ?? null,
          phoneNumber: dto.phoneNumber,
          clothingSize: dto.clothingSize,
          footwearSize: dto.footwearSize,
          position: dto.position,
          objectId: dto.objectId ?? null,
        },
      });
    } catch (error) {
      console.error(error);
      handlePrismaError(error, {
        conflictMessage:
          'Сотрудник с таким именем, фамилией и телефоном уже существует',
        defaultMessage: 'Не удалось создать сотрудника',
      });
    }
  }

  public async getById(id: string) {
    try {
      return await this.prismaService.employee.findUniqueOrThrow({
        where: { id },
        include: {
          workPlace: true,
          clothing: true,
        },
      });
    } catch (error) {
      console.error(error);
      handlePrismaError(error, {
        notFoundMessage: 'Сотрудник не найден',
        defaultMessage: 'Ошибка при поиске сотрудника',
      });
    }
  }

  public async getAll() {
    try {
      return await this.prismaService.employee.findMany({
        include: {
          workPlace: true,
          clothing: true,
        },
        orderBy: { lastName: 'asc' },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Не удалось получить список сотрудников',
      );
    }
  }

  public async update(id: string, dto: UpdateDto) {
    try {
      return await this.prismaService.employee.update({
        where: { id },
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          fatherName: dto.fatherName ?? null,
          phoneNumber: dto.phoneNumber,
          clothingSize: dto.clothingSize,
          footwearSize: dto.footwearSize,
          position: dto.position,
          objectId: dto.objectId ?? null,
        },
      });
    } catch (error) {
      console.error(error);
      handlePrismaError(error, {
        notFoundMessage: 'Сотрудник не найден',
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось обновить сотрудника',
      });
    }
  }

  public async transfer(id: string, objectId: string) {
    try {
      return await this.prismaService.employee.update({
        where: { id },
        data: {
          objectId: objectId,
        },
      });
    } catch (error) {
      console.error(error);
      handlePrismaError(error, {
        notFoundMessage: 'Сотрудник не найден',
        conflictMessage: 'Обновление нарушает уникальность данных',
        defaultMessage: 'Не удалось обновить сотрудника',
      });
    }
  }

  public async delete(id: string) {
    try {
      await this.prismaService.employee.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error(error);
      handlePrismaError(error, {
        notFoundMessage: 'Сотрудник не найден',
        defaultMessage: 'Не удалось удалить сотрудника',
      });
    }
  }
}
