import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShiftTemplateDto } from './dto/createShiftTemplate.dto';
import { UpdateShiftTemplateDto } from './dto/updateShiftTemplate.dto';

@Injectable()
export class ShiftTemplateService {
  constructor(private readonly prismaService: PrismaService) {}

  async createShiftTemplate(dto: CreateShiftTemplateDto, userId: string) {
    return this.prismaService.$transaction(async (prisma) => {
      const shift = await prisma.shiftTemplate.create({
        data: {
          name: dto.name,
          plannedHours: dto.plannedHours,
          objectId: dto.objectId,
          createdById: userId,
          employees: {
            create: dto.employees.map((emp) => ({
              employeeId: emp.employeeId,
              workedHours: emp.workedHours,
              present: emp.present,
              absenceReason: emp.absenceReason ?? null,
              task: emp.task ?? null,
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

  async updateShiftTemplate(id: string, dto: UpdateShiftTemplateDto) {
    return this.prismaService.$transaction(async (prisma) => {
      return await prisma.shiftTemplate.update({
        where: { id },
        data: {
          plannedHours: dto.plannedHours,
          name: dto.name,
          objectId: dto.objectId,
          employees: {
            deleteMany: {},
            create: dto.employees.map((emp) => ({
              employeeId: emp.employeeId,
              workedHours: emp.workedHours,
              present: emp.present,
              absenceReason: emp.absenceReason,
              task: emp.task,
            })),
          },
        },
        include: { employees: { include: { employee: true } } },
      });
    });
  }

  async getShiftTemplatesByObject(objectId: string) {
    return this.prismaService.shiftTemplate.findMany({
      where: { objectId },
      include: {
        employees: {
          include: { employee: true }, // подтягиваем данные сотрудника
        },
      },
    });
  }

  async deleteShiftTemplate(templateId: string) {
    return this.prismaService.shiftTemplate.delete({
      where: { id: templateId },
    });
  }
}
