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
            isReturned: false,
            debtAmount: { gt: 0 },
          },
          include: { clothing: true },
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
}
