import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IssueClothingDto } from './dto/issue-clothing.dto';
import { handlePrismaError } from 'src/libs/common/utils/prisma-error.util';
import { ChangeDebtDto } from './dto/change-debt.dto';
import { UpdateIssuedClothingDto } from './dto/update-issued-clothing.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class EmployeeClothingService {
  constructor(private prismaService: PrismaService) {}

  async issueClothing(employeeId: string, dto: IssueClothingDto) {
    try {
      const clothing = await this.prismaService.clothes.findUnique({
        where: { id: dto.clothingId },
      });

      if (!clothing) throw new NotFoundException('Одежда не найдена');
      if (clothing.quantity < 1) throw new BadRequestException('Нет в наличии');

      const result = await this.prismaService.$transaction(async (prisma) => {
        await prisma.clothes.update({
          where: { id: dto.clothingId },
          data: { quantity: { decrement: 1 } },
        });

        return prisma.employeeClothing.create({
          data: {
            employeeId,
            clothingId: dto.clothingId,
            priceWhenIssued: clothing.price,
            debtAmount: clothing.price,
          },
          include: {
            clothing: true,
            employee: true,
          },
        });
      });

      return result;
    } catch (error) {
      console.error(error);
      handlePrismaError(error, {
        defaultMessage: 'Ошибка при выдаче одежды',
      });
    }
  }

  async getEmployeeDebtDetails(employeeId: string) {
    try {
      const items = await this.prismaService.employeeClothing.findMany({
        where: { employeeId },
        include: {
          clothing: {
            select: {
              name: true,
              id: true,
              season: true,
              clothingHeight: true,
              clothingSize: true,
              footwearSize: true,
              type: true,
            },
          },
        },
        orderBy: { issuedAt: 'asc' },
      });

      // сумма всех Decimal → Decimal
      const totalDebtDecimal = items.reduce(
        (sum, item) => sum.plus(item.debtAmount ?? 0),
        new Decimal(0),
      );

      // если нужно вернуть number, делаем toNumber()
      const totalDebt = totalDebtDecimal.toNumber();

      return { items, totalDebt };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Ошибка получения задолженности сотрудника',
      );
    }
  }

  async changeDebt(recordId: string, dto: ChangeDebtDto) {
    try {
      const deduction = new Decimal(dto.debt);
      if (deduction.lte(0)) {
        throw new BadRequestException('Сумма списания должна быть больше 0');
      }

      const employeeClothingRec =
        await this.prismaService.employeeClothing.findFirstOrThrow({
          where: { id: recordId, isReturned: false },
        });

      const currentDebt = new Decimal(employeeClothingRec.debtAmount);
      const newDebt = currentDebt.minus(deduction);
      const newDebtFixed = newDebt.isNegative() ? new Decimal(0) : newDebt;
      const isReturned = newDebtFixed.eq(0);

      return await this.prismaService.employeeClothing.update({
        where: { id: recordId },
        data: {
          debtAmount: newDebtFixed,
          isReturned,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Ошибка при изменении задолженности',
      );
    }
  }

  async updateIssuedClothing(recordId: string, dto: UpdateIssuedClothingDto) {
    try {
      const existing = await this.prismaService.employeeClothing.findUnique({
        where: { id: recordId },
      });

      if (!existing) throw new NotFoundException('Запись не найдена');

      const updated = await this.prismaService.employeeClothing.update({
        where: { id: recordId },
        data: {
          priceWhenIssued: new Decimal(dto.priceWhenIssued),
          debtAmount: new Decimal(dto.debtAmount),
          issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : existing.issuedAt,
          clothing: {
            update: {
              clothingSizeId: dto.clothingSizeId ?? undefined,
              clothingHeightId: dto.clothingHeightId ?? undefined,
              footwearSizeId: dto.footwearSizeId ?? undefined,
            },
          },
        },
        include: {
          clothing: {
            include: {
              clothingSize: true,
              clothingHeight: true,
              footwearSize: true,
            },
          },
        },
      });

      return updated;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Ошибка при обновлении выданной одежды',
      );
    }
  }
}
