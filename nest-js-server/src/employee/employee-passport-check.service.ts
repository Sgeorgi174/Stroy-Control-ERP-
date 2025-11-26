import { Injectable } from '@nestjs/common';
import { EmployeeWarningType, Statuses } from '@prisma/client';
import type { Employee } from '@prisma/client';

@Injectable()
export class EmployeePassportCheckService {
  check(employee: Employee) {
    const warnings: {
      employeeId: string;
      warningType: EmployeeWarningType;
      message: string;
    }[] = [];

    let status: Statuses = Statuses.OK;

    if (employee.country !== 'RU') return { status, warnings };

    const now = new Date();
    const birthDate = new Date(employee.dob);
    const passportIssueDate = new Date(employee.issueDate);

    const ageAtIssue =
      passportIssueDate.getFullYear() - birthDate.getFullYear();

    // Определяем следующий возраст для замены паспорта
    let nextReplacementAge: number | null = null;

    if (ageAtIssue === 14) {
      nextReplacementAge = 20;
    } else if (ageAtIssue < 45) {
      nextReplacementAge = 45;
    } else {
      // Паспорт выдан после 45 лет — не отслеживаем
      return { status: Statuses.OK, warnings };
    }

    // Дата, когда нужно заменить паспорт
    const passportExpiryDate = new Date(
      birthDate.getFullYear() + nextReplacementAge,
      birthDate.getMonth(),
      birthDate.getDate(),
    );

    // Разница в днях
    const oneDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.floor(
      (passportExpiryDate.getTime() - now.getTime()) / oneDay,
    );

    let message: string | null = null;

    if (diffDays < 0) {
      status = Statuses.OVERDUE;
      message = 'Срок замены паспорта просрочен';
    } else if (diffDays <= 14) {
      status = Statuses.WARNING;
      message = `Срок замены паспорта истекает через ${diffDays} ${this.getDaysWord(diffDays)}`;
    }

    if (message) {
      warnings.push({
        employeeId: employee.id,
        warningType: EmployeeWarningType.PASSPORT,
        message,
      });
    }

    return { status, warnings };
  }

  private getDaysWord(n: number) {
    const abs = Math.abs(n) % 100;
    const last = abs % 10;
    if (abs > 10 && abs < 20) return 'дней';
    if (last > 1 && last < 5) return 'дня';
    if (last === 1) return 'день';
    return 'дней';
  }
}
