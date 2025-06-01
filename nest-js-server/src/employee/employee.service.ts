import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

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
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Сотрудник с таким именем, фамилией и телефоном уже существует',
        );
      }
      throw new InternalServerErrorException('Не удалось создать сотрудника');
    }
  }

  public async getById(id: string) {
    try {
      const employee = await this.prismaService.employee.findUniqueOrThrow({
        where: { id },
        include: {
          workPlace: true,
          clothing: true,
        },
      });
      return employee;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Сотрудник не найден');
      }
      throw new InternalServerErrorException('Ошибка при поиске сотрудника');
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
    } catch {
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
          debt: dto.debt ?? 0,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Сотрудник не найден');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Обновление нарушает уникальность данных');
      }
      throw new InternalServerErrorException('Не удалось обновить сотрудника');
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
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Сотрудник не найден');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Обновление нарушает уникальность данных');
      }

      throw new InternalServerErrorException('Не удалось обновить сотрудника');
    }
  }

  public async changeDebt(id: string, amount: number) {
    try {
      return this.prismaService.employee.update({
        where: { id },
        data: {
          debt: { increment: amount },
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Сотрудник не найден');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Обновление нарушает уникальность данных');
      }
      throw new InternalServerErrorException('Не удалось обновить сотрудника');
    }
  }

  public async delete(id: string) {
    try {
      await this.prismaService.employee.delete({ where: { id } });
      return true;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Сотрудник не найден');
      }
      throw new InternalServerErrorException('Не удалось удалить сотрудника');
    }
  }
}
