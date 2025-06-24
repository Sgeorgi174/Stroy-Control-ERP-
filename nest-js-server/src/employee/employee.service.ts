import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { handlePrismaError } from 'src/libs/common/utils/prisma-error.util';
import { GetEmployeeQueryDto } from './dto/employee-query.dto';
import { TransferEmployeeDto } from './dto/transfer.dto';
import { AssignEmployeesDto } from './dto/assign-employees.dto';

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

  public async getFiltered(query: GetEmployeeQueryDto) {
    const employees = await this.prismaService.employee.findMany({
      where: {
        ...(query.objectId ? { objectId: query.objectId } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(query.position ? { position: query.position } : {}),
        ...(query.firstName
          ? { name: { contains: query.firstName, mode: 'insensitive' } }
          : {}),
        ...(query.lastName
          ? { name: { contains: query.lastName, mode: 'insensitive' } }
          : {}),
      },
      include: {
        skills: true,
        workPlace: { select: { name: true, address: true, id: true } },
        clothing: true,
      },
    });

    return employees;
  }

  public async getFreeEmployees() {
    const employees = await this.prismaService.employee.findMany({
      where: { objectId: null },
    });

    return employees;
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

  public async transfer(id: string, dto: TransferEmployeeDto) {
    try {
      return await this.prismaService.employee.update({
        where: { id },
        data: {
          objectId: dto.objectId,
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

  public async assignToObject(dto: AssignEmployeesDto) {
    try {
      await this.prismaService.employee.updateMany({
        where: {
          id: { in: dto.employeeIds },
        },
        data: {
          objectId: dto.objectId,
        },
      });

      return { success: true, assignedCount: dto.employeeIds.length };
    } catch (error) {
      console.error(error);
      handlePrismaError(error, {
        defaultMessage: 'Не удалось назначить сотрудников на объект',
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
