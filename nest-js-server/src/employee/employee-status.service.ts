// employee-status.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeClothingCheckService } from './employee-clothing-check.service';
import { EmployeePassportCheckService } from './employee-passport-check.service';
import { Statuses, EmployeeWarningType } from 'generated/prisma';

@Injectable()
export class EmployeeStatusService {
  private readonly logger = new Logger(EmployeeStatusService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly clothingCheck: EmployeeClothingCheckService,
    private readonly passportCheck: EmployeePassportCheckService,
  ) {}

  @Cron('0 * * * * *', { timeZone: 'Europe/Moscow' })
  async updateEmployeeStatuses() {
    this.logger.log('Начинаем проверку статусов сотрудников');

    const employees = await this.prisma.employee.findMany({
      where: { type: 'ACTIVE' },
      include: {
        clothing: { where: { isReturned: false }, include: { clothing: true } },
      },
    });

    for (const employee of employees) {
      let status: Statuses = Statuses.OK;
      const warningsRows: {
        employeeId: string;
        warningType: EmployeeWarningType;
        message: string;
      }[] = [];

      const clothingResult = this.clothingCheck.check(employee);
      const passportResult = this.passportCheck.check(employee);

      // Выбираем наихудший статус
      status = [
        Statuses.OK,
        clothingResult.status,
        passportResult.status,
      ].includes(Statuses.OVERDUE)
        ? Statuses.OVERDUE
        : clothingResult.status === Statuses.WARNING ||
            passportResult.status === Statuses.WARNING
          ? Statuses.WARNING
          : Statuses.OK;

      warningsRows.push(...clothingResult.warnings, ...passportResult.warnings);

      // Атомарно обновляем статус и предупреждения
      await this.prisma.$transaction(async (prisma) => {
        await prisma.employee.update({
          where: { id: employee.id },
          data: { status },
        });

        // Удаляем старые предупреждения по спецовке и паспорту
        await prisma.employeeWarning.deleteMany({
          where: {
            employeeId: employee.id,
            warningType: {
              in: [
                EmployeeWarningType.CLOTHING_SUMMER,
                EmployeeWarningType.CLOTHING_WINTER,
                EmployeeWarningType.FOOTWEAR_SUMMER,
                EmployeeWarningType.FOOTWEAR_WINTER,
                EmployeeWarningType.PASSPORT,
              ],
            },
          },
        });

        if (warningsRows.length > 0) {
          await prisma.employeeWarning.createMany({ data: warningsRows });
        }
      });
    }

    this.logger.log('Проверка статусов сотрудников завершена');
  }

  /** 🔹 Проверка статуса одного сотрудника */
  async updateEmployeeStatusById(employeeId: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        clothing: { where: { isReturned: false }, include: { clothing: true } },
      },
    });

    if (!employee) return null;

    let status: Statuses = Statuses.OK;
    const warningsRows: {
      employeeId: string;
      warningType: EmployeeWarningType;
      message: string;
    }[] = [];

    const clothingResult = this.clothingCheck.check(employee);
    const passportResult = this.passportCheck.check(employee);

    // Определяем наихудший статус
    if (
      [clothingResult.status, passportResult.status].includes(Statuses.OVERDUE)
    ) {
      status = Statuses.OVERDUE;
    } else if (
      [clothingResult.status, passportResult.status].includes(Statuses.WARNING)
    ) {
      status = Statuses.WARNING;
    }

    warningsRows.push(...clothingResult.warnings, ...passportResult.warnings);

    await this.prisma.$transaction(async (tx) => {
      // Обновляем статус
      await tx.employee.update({
        where: { id: employee.id },
        data: { status },
      });

      // Удаляем старые предупреждения по clothing и паспорту
      await tx.employeeWarning.deleteMany({
        where: {
          employeeId: employee.id,
          warningType: {
            in: [
              EmployeeWarningType.CLOTHING_SUMMER,
              EmployeeWarningType.CLOTHING_WINTER,
              EmployeeWarningType.FOOTWEAR_SUMMER,
              EmployeeWarningType.FOOTWEAR_WINTER,
              EmployeeWarningType.PASSPORT,
            ],
          },
        },
      });

      // Добавляем новые предупреждения
      if (warningsRows.length > 0) {
        await tx.employeeWarning.createMany({ data: warningsRows });
      }
    });

    return { status, warnings: warningsRows };
  }
}
