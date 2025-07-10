import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IssueClothingDto } from './dto/issue-clothing.dto';
import { EmployeeClothing } from 'generated/prisma';
import { handlePrismaError } from 'src/libs/common/utils/prisma-error.util';
import { ChangeDebtDto } from './dto/change-debt.dto';

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
      const items: EmployeeClothing[] =
        await this.prismaService.employeeClothing.findMany({
          where: {
            employeeId,
          },
          include: {
            clothing: {
              select: { name: true, id: true, season: true, size: true },
            },
          },
          orderBy: { issuedAt: 'asc' },
        });

      const totalDebt: number = items.reduce((sum, item) => {
        return sum + (item.debtAmount ?? 0);
      }, 0);

      return { items, totalDebt };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Ошибка получения задолженности сотрудника',
      );
    }
  }

  async changeDebt(recordId: string, dto: ChangeDebtDto) {
    console.log(recordId, dto);

    try {
      if (dto.debt <= 0) {
        throw new BadRequestException('Сумма списания должна быть больше 0');
      }

      const employeeClothingRec =
        await this.prismaService.employeeClothing.findFirstOrThrow({
          where: {
            id: recordId,
            isReturned: false, // работаем только с незакрытыми долгами
          },
        });

      const currentDebt = employeeClothingRec.debtAmount;
      const newDebt = Math.max(0, currentDebt - dto.debt); // не позволим уйти в минус
      const isReturned = newDebt === 0;

      return await this.prismaService.employeeClothing.update({
        where: { id: recordId },
        data: {
          debtAmount: newDebt,
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
}
