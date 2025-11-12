// src/employees/employee-status.service.ts
import { Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { ClothesType, Season } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

// type StatusesType = 'OK' | 'WARNING' | 'OVERDUE' | 'INACTIVE';

@Injectable()
export class EmployeeStatusService {
  constructor(private readonly prisma: PrismaService) {}

  //   @Cron('0 * * * * *', {
  //     timeZone: 'Europe/Moscow',
  //   })
  //   async updateEmployeeStatuses() {
  //     console.log('Начинаем проверку статусов сотрудников');

  //     const employees = await this.prisma.employee.findMany({
  //       where: { type: 'ACTIVE' },
  //       include: {
  //         clothing: {
  //           where: { isReturned: false },
  //           include: {
  //             clothing: true,
  //           },
  //         },
  //       },
  //     });

  //     const now = new Date();

  //     for (const employee of employees) {
  //       let status: StatusesType = 'OK';

  //       const latestByTypeSeason: Record<string, Date> = {};

  //       for (const ec of employee.clothing) {
  //         const key = `${ec.clothing.type}-${ec.clothing.season}`;
  //         if (!latestByTypeSeason[key] || ec.issuedAt > latestByTypeSeason[key]) {
  //           latestByTypeSeason[key] = ec.issuedAt;
  //         }
  //       }

  //       // Проверяем сроки для спецовки
  //       for (const [key, issuedAt] of Object.entries(latestByTypeSeason)) {
  //         const [type, season] = key.split('-') as [ClothesType, Season];
  //         const expiryDate = new Date(issuedAt);

  //         if (type === ClothesType.CLOTHING) {
  //           expiryDate.setFullYear(
  //             expiryDate.getFullYear() + (season === Season.SUMMER ? 1 : 2),
  //           );
  //         } else if (type === ClothesType.FOOTWEAR) {
  //           expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  //         }

  //         const diffDays =
  //           (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  //         if (diffDays < 0) {
  //           status = 'OVERDUE';
  //         } else if (diffDays <= 14 && status !== 'OVERDUE') {
  //           status = 'WARNING';
  //         }
  //       }

  //       await this.prisma.employee.update({
  //         where: { id: employee.id },
  //         data: { status },
  //       });
  //     }

  //     console.log('Проверка статусов сотрудников завершена');
  //   }
}
