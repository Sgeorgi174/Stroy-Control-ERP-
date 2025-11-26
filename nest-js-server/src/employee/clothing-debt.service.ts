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
      console.log('Получаем выданную одежду...');
      const issuedClothes = await this.prisma.employeeClothing.findMany({
        where: { isReturned: false },
        include: { clothing: true },
      });

      console.log('Найдено записей:', issuedClothes.length);

      if (issuedClothes.length === 0) {
        console.log('Нет записей — завершение работы CRON');
        return;
      }

      console.log('Запуск транзакции...');
      await this.prisma.$transaction(async (prisma) => {
        console.log('Транзакция началась');

        for (const record of issuedClothes) {
          console.log('--- Обработка записи:', record.id);

          let monthsToWriteOff = 12;

          console.log(
            `Тип: ${record.clothing.type}, сезон: ${record.clothing.season}`,
          );

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

          console.log('Месяцев к списанию:', monthsToWriteOff);

          const price = new Decimal(record.priceWhenIssued);
          console.log('Цена при выдаче:', price.toString());

          const dailyDeduction = price.div(monthsToWriteOff * 30);
          console.log('Ежедневное списание (raw):', dailyDeduction.toString());

          const dailyRounded = this.roundUpOneDecimalDecimal(dailyDeduction);
          console.log('Ежедневное списание (округл):', dailyRounded.toString());

          const currentDebt = new Decimal(record.debtAmount);
          console.log('Текущий долг:', currentDebt.toString());

          const newDebt = currentDebt.minus(dailyRounded);
          console.log('Новый долг (raw):', newDebt.toString());

          const newDebtFinal = newDebt.isNegative() ? new Decimal(0) : newDebt;
          console.log('Новый долг (final):', newDebtFinal.toString());

          const isReturned = newDebtFinal.eq(0);
          console.log('isReturned:', isReturned);

          console.log('Обновляем запись...');
          await prisma.employeeClothing.update({
            where: { id: record.id },
            data: {
              debtAmount: newDebtFinal,
              isReturned,
            },
          });

          console.log('Обновление завершено:', record.id);
        }

        console.log('Транзакция завершена успешно');
      });

      console.log('=== END Cron: Успешно завершено ===');
    } catch (error) {
      console.error('=== ERROR в CRON ===');
      console.error(error);

      throw new InternalServerErrorException(
        'Не удалось выполнить списание долгов по спецовке',
      );
    }
  }
}
