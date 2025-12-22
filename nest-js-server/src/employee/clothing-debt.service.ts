import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Decimal } from '@prisma/client/runtime/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClothingDebtCronService {
  constructor(private readonly prisma: PrismaService) {}

  private roundUpOneDecimalDecimal(num: Decimal): Decimal {
    return num.mul(10).floor().div(10);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Europe/Moscow',
  })
  async handleDailyDebtDeduction() {
    console.log('=== START Cron: Долги спецовки ===');

    try {
      const issuedClothes = await this.prisma.employeeClothing.findMany({
        where: {
          isReturned: false,
          debtAmount: {
            gt: new Decimal(0),
          },
        },
        include: {
          clothing: true,
          customClothes: true,
        },
      });

      if (issuedClothes.length === 0) {
        console.log('Нет активных долгов — выход');
        return;
      }

      await this.prisma.$transaction(async (prisma) => {
        for (const record of issuedClothes) {
          const source = record.clothing ?? record.customClothes;

          if (!source) {
            console.warn(
              `Пропуск записи ${record.id} — нет clothing/customClothes`,
            );
            continue;
          }

          const { type, season } = source;

          let monthsToWriteOff = 12;

          if (type === 'CLOTHING' && season === 'WINTER') {
            monthsToWriteOff = 24;
          } else if (type === 'CLOTHING' && season === 'SUMMER') {
            monthsToWriteOff = 12;
          } else if (type === 'FOOTWEAR') {
            monthsToWriteOff = 12;
          }

          const price = new Decimal(record.priceWhenIssued);
          const dailyRaw = price.div(monthsToWriteOff * 30);
          const daily = this.roundUpOneDecimalDecimal(dailyRaw);

          const currentDebt = new Decimal(record.debtAmount);
          const newDebt = currentDebt.minus(daily);
          const newDebtFinal = newDebt.isNegative() ? new Decimal(0) : newDebt;

          await prisma.employeeClothing.update({
            where: { id: record.id },
            data: {
              debtAmount: newDebtFinal,
              isReturned: newDebtFinal.eq(0),
            },
          });
        }
      });

      console.log('=== END Cron: Успешно ===');
    } catch (error) {
      console.error('=== ERROR в CRON ===', error);
      throw new InternalServerErrorException(
        'Не удалось выполнить ежедневное списание долгов',
      );
    }
  }
}
