import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShiftDto } from './dto/createShift.dto';
import { UpdateShiftDto } from './dto/updateShift.dto';
import { GetShiftsFilterDto } from './dto/getShiftFilter.dto';

@Injectable()
export class ShiftService {
  constructor(private readonly prismaService: PrismaService) {}

  async createShift(dto: CreateShiftDto, userId: string) {
    return this.prismaService.$transaction(async (prisma) => {
      const shift = await prisma.shift.create({
        data: {
          shiftDate: dto.shiftDate,
          plannedHours: dto.plannedHours,
          totalHours: dto.employees.reduce(
            (sum, emp) => sum + (emp.workedHours ?? 0),
            0,
          ),
          objectId: dto.objectId,
          createdById: userId,
          employees: {
            create: dto.employees.map((emp) => ({
              employeeId: emp.employeeId,
              workedHours: emp.workedHours,
              present: emp.present,
              absenceReason: emp.absenceReason ?? null,
              task: emp.task ?? null,
              isLocal: emp.isLocal,
            })),
          },
        },
        include: {
          employees: true,
        },
      });

      return shift;
    });
  }

  async updateShift(id: string, dto: UpdateShiftDto) {
    return this.prismaService.$transaction(async (prisma) => {
      // если надо заменить состав сотрудников
      if (dto.employees) {
        await prisma.shiftEmployee.deleteMany({
          where: { shiftId: id },
        });

        await prisma.shiftEmployee.createMany({
          data: dto.employees.map((emp) => ({
            shiftId: id,
            employeeId: emp.employeeId,
            workedHours: emp.workedHours,
            present: emp.present,
            absenceReason: emp.absenceReason ?? null,
            task: emp.task ?? null,
            isLocal: emp.isLocal,
          })),
        });
      }

      // считаем totalHours заново
      const totalHours = dto.employees
        ? dto.employees.reduce((sum, emp) => sum + (emp.workedHours ?? 0), 0)
        : undefined;

      const shift = await prisma.shift.update({
        where: { id },
        data: {
          shiftDate: dto.shiftDate,
          plannedHours: dto.plannedHours,
          updatedReason: dto.updatedReason,
          ...(totalHours !== undefined ? { totalHours } : {}),
        },
        include: { employees: true },
      });

      return shift;
    });
  }

  async getShiftsByObject(objectId: string) {
    return this.prismaService.shift.findMany({
      where: { objectId },
      include: {
        employees: {
          include: { employee: true }, // подтягиваем данные сотрудника
        },
      },
      orderBy: { shiftDate: 'asc' },
    });
  }

  async getShiftsWithFilters(filter: GetShiftsFilterDto) {
    const { fromDate, toDate, objectId, employeeIds } = filter;

    return this.prismaService.shift.findMany({
      where: {
        objectId: objectId ?? undefined,
        shiftDate: {
          gte: fromDate ? new Date(fromDate) : undefined,
          lte: toDate ? new Date(toDate) : undefined,
        },
        employees: employeeIds?.length
          ? {
              some: {
                employeeId: { in: employeeIds },
              },
            }
          : undefined,
      },
      include: {
        employees: {
          include: { employee: true },
        },
      },
      orderBy: { shiftDate: 'asc' },
    });
  }
}
