import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClothingDebtCronService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Europe/Moscow',
  })
  async handleDailyDebtDeduction() {
    console.log('Запуск ежедневного списания долгов по спецовке');
    try {
      // Берём все невозвращенные спецовки
      const issuedClothes = await this.prisma.employeeClothing.findMany({
        where: { isReturned: false },
        include: { clothing: true },
      });

      if (issuedClothes.length === 0) return;

      await this.prisma.$transaction(async (prisma) => {
        for (const record of issuedClothes) {
          let monthsToWriteOff = 12;

          if (
            record.clothing.type === 'CLOTHING' &&
            record.clothing.season === 'WINTER'
          ) {
            monthsToWriteOff = 24;
          } else if (
            record.clothing.type === 'CLOTHING' &&
            record.clothing.season === 'SUMMER'
          ) {
            monthsToWriteOff = 12;
          } else if (record.clothing.type === 'FOOTWEAR') {
            monthsToWriteOff = 12;
          }

          const dailyDeduction =
            record.priceWhenIssued / (monthsToWriteOff * 30);
          const newDebt = Math.max(
            0,
            record.debtAmount - Math.ceil(dailyDeduction),
          );
          const isReturned = newDebt <= 0;

          await prisma.employeeClothing.update({
            where: { id: record.id },
            data: { debtAmount: newDebt, isReturned },
          });
        }

        console.log('Списание успешно закончено');
      });
    } catch (error) {
      console.error('Ошибка при ежедневном списании долгов', error);

      throw new InternalServerErrorException(
        'Не удалось выполнить списание долгов по спецовке',
      );
    }
  }
}
