// employee-clothing-check.service.ts
import { Injectable } from '@nestjs/common';
import {
  ClothesType,
  Season,
  EmployeeWarningType,
  Statuses,
} from '@prisma/client';
import type { Prisma } from '@prisma/client';

type EmployeeWithClothing = Prisma.EmployeeGetPayload<{
  include: { clothing: { include: { clothing: true } } };
}>;

@Injectable()
export class EmployeeClothingCheckService {
  check(employee: EmployeeWithClothing) {
    let status: Statuses = Statuses.OK;
    const warnings: {
      employeeId: string;
      warningType: EmployeeWarningType;
      message: string;
    }[] = [];
    const now = new Date();

    const latestByTypeSeason: Record<string, Date> = {};
    for (const ec of employee.clothing) {
      if (!ec.clothing) continue;
      const key = `${ec.clothing.type}-${ec.clothing.season}`;
      if (!latestByTypeSeason[key] || ec.issuedAt > latestByTypeSeason[key]) {
        latestByTypeSeason[key] = ec.issuedAt;
      }
    }

    for (const [key, issuedAt] of Object.entries(latestByTypeSeason)) {
      const [type, season] = key.split('-') as [ClothesType, Season];
      const expiryDate = new Date(issuedAt);

      if (type === ClothesType.CLOTHING) {
        expiryDate.setFullYear(
          expiryDate.getFullYear() + (season === Season.SUMMER ? 1 : 2),
        );
      } else if (type === ClothesType.FOOTWEAR) {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }

      const diffDays =
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      let warningType: EmployeeWarningType | null = null;
      let message: string | null = null;

      if (diffDays < 0) {
        status = Statuses.OVERDUE;
        warningType =
          type === ClothesType.CLOTHING
            ? season === Season.SUMMER
              ? EmployeeWarningType.CLOTHING_SUMMER
              : EmployeeWarningType.CLOTHING_WINTER
            : season === Season.SUMMER
              ? EmployeeWarningType.FOOTWEAR_SUMMER
              : EmployeeWarningType.FOOTWEAR_WINTER;
        message = `Срок ${season === 'SUMMER' ? 'летней' : 'зимней'} ${
          type === 'CLOTHING' ? 'спец. одежды' : 'обуви'
        } просрочен`;
      } else if (diffDays <= 14 && status !== Statuses.OVERDUE) {
        status = Statuses.WARNING;
        warningType =
          type === ClothesType.CLOTHING
            ? season === Season.SUMMER
              ? EmployeeWarningType.CLOTHING_SUMMER
              : EmployeeWarningType.CLOTHING_WINTER
            : season === Season.SUMMER
              ? EmployeeWarningType.FOOTWEAR_SUMMER
              : EmployeeWarningType.FOOTWEAR_WINTER;
        message = `Срок ${season === 'SUMMER' ? 'летней' : 'зимней'} ${
          type === 'CLOTHING' ? 'спец. одежды' : 'обуви'
        } истекает через ${Math.ceil(diffDays)} дней`;
      }

      if (warningType && message) {
        warnings.push({ employeeId: employee.id, warningType, message });
      }
    }

    return { status, warnings };
  }
}
