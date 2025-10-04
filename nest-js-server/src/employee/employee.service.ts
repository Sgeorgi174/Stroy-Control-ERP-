import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { handlePrismaError } from 'src/libs/common/utils/prisma-error.util';
import { GetEmployeeQueryDto } from './dto/employee-query.dto';
import { TransferEmployeeDto } from './dto/transfer.dto';
import { AssignEmployeesDto } from './dto/assign-employees.dto';
import { AddSkillsDto } from './dto/add-skill.dto';
import { RemoveSkillsDto } from './dto/remove-skill.dto';
import { ArchiveDto } from './dto/archive-employee.dto';

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
          skills:
            dto.skillIds && dto.skillIds.length > 0
              ? {
                  connect: dto.skillIds.map((id) => ({ id })),
                }
              : undefined,
        },
        include: {
          skills: { select: { id: true, skill: true } },
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
          workPlace: { select: { name: true, address: true, id: true } },
          archive: { select: { id: true, comment: true, archivedAt: true } },
          clothing: {
            select: {
              id: true,
              priceWhenIssued: true,
              issuedAt: true,
              debtAmount: true,
              clothing: {
                select: {
                  id: true,
                  name: true,
                  closthingHeight: true,
                  closthingSize: true,
                  footwearSize: true,
                  season: true,
                },
              },
            },
          },
          skills: { select: { skill: true, id: true } },
          devices: {
            select: { id: true, name: true, serialNumber: true, status: true },
          },
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
    const { skillIds = [] } = query;

    const employees = await this.prismaService.employee.findMany({
      where: {
        ...(query.objectId === 'all'
          ? {}
          : query.objectId
            ? { objectId: query.objectId }
            : { objectId: null }),
        ...(query.status ? { status: query.status } : {}),
        ...(query.position ? { position: query.position } : {}),
        ...(query.type ? { type: query.type } : {}),
        ...(query.searchQuery
          ? {
              OR: [
                {
                  firstName: {
                    contains: query.searchQuery,
                    mode: 'insensitive',
                  },
                },
                {
                  lastName: {
                    contains: query.searchQuery,
                    mode: 'insensitive',
                  },
                },
                {
                  phoneNumber: {
                    contains: query.searchQuery,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
        ...(skillIds.length > 0
          ? {
              AND: skillIds.map((skillId) => ({
                skills: {
                  some: {
                    id: skillId,
                  },
                },
              })),
            }
          : {}),
      },
      include: {
        skills: { select: { skill: true, id: true } },
        workPlace: { select: { name: true, address: true, id: true } },
        archive: {
          select: {
            id: true,
            comment: true,
            archivedAt: true,
            changedBy: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        clothing: {
          select: {
            id: true,
            priceWhenIssued: true,
            issuedAt: true,
            debtAmount: true,
            clothing: {
              select: {
                id: true,
                name: true,
                closthingHeight: true,
                closthingSize: true,
                footwearSize: true,
                season: true,
              },
            },
          },
        },
      },
      orderBy: { lastName: 'asc' },
    });

    return employees;
  }

  public async getFreeEmployees() {
    const employees = await this.prismaService.employee.findMany({
      where: { objectId: null, type: 'ACTIVE' },
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

  public async unassignFromObject(id: string) {
    try {
      return await this.prismaService.employee.update({
        where: { id },
        data: {
          objectId: null,
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

  public async addSkillsToEmployee(employeeId: string, dto: AddSkillsDto) {
    try {
      return await this.prismaService.employee.update({
        where: { id: employeeId },
        data: {
          skills: {
            connect: dto.skillIds.map((id) => ({ id })),
          },
        },
        include: {
          skills: true,
        },
      });
    } catch (error) {
      console.error(error);
      handlePrismaError(error, {
        notFoundMessage: 'Сотрудник или навык не найден',
        defaultMessage: 'Не удалось добавить навыки сотруднику',
      });
    }
  }

  public async removeSkillFromEmployee(
    employeeId: string,
    dto: RemoveSkillsDto,
  ) {
    try {
      return await this.prismaService.employee.update({
        where: { id: employeeId },
        data: {
          skills: {
            disconnect: { id: dto.skillId },
          },
        },
        include: {
          skills: true,
        },
      });
    } catch (error) {
      console.error(error);
      handlePrismaError(error, {
        notFoundMessage: 'Сотрудник или навык не найден',
        defaultMessage: 'Не удалось удалить навык у сотрудника',
      });
    }
  }

  public async archiveEmployee(id: string, dto: ArchiveDto, userId: string) {
    const employee = await this.getById(id);

    if (employee.clothing.filter((item) => item.debtAmount > 0).length > 0)
      throw new BadRequestException(
        'Архивация не возможна. У сотрудника есть непогашенный долг',
      );

    if (employee.devices.length > 0)
      throw new BadRequestException(
        'Архивация не возможна. У сотрудника остался планшет',
      );

    if (employee.type === 'ARCHIVE')
      throw new BadRequestException('Сотрудник уже в архиве');

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.employee.update({
          where: { id },
          data: { type: 'ARCHIVE', objectId: null, status: 'INACTIVE' },
        });

        await prisma.employeeArchive.create({
          data: { employeeId: id, comment: dto.comment, userId },
        });
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Сотрудник не найден',
        defaultMessage: 'Не удалось архивировать сотрудника',
      });
    }
  }

  public async restoreEmployee(id: string) {
    const employee = await this.getById(id);

    if (!employee.archive) {
      throw new BadRequestException('Сотрудник не находится в архиве');
    }

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.employeeArchive.delete({
          where: {
            employeeId: id,
          },
        });

        // Обновляем сотрудника
        return await prisma.employee.update({
          where: { id },
          data: {
            type: 'ACTIVE',
            status: 'OK',
          },
        });
      });
    } catch (error) {
      handlePrismaError(error, {
        notFoundMessage: 'Сотрудник не найден',
        defaultMessage: 'Не удалось восстановить сотрудника из архива',
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
