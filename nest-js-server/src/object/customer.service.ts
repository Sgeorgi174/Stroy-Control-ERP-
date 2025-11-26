import { Injectable, NotFoundException } from '@nestjs/common';
import { handlePrismaError } from 'src/libs/common/utils/prisma-error.util';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private readonly prismaService: PrismaService) {}

  /** Создание нового заказчика */
  async create(dto: CreateCustomerDto) {
    try {
      return await this.prismaService.customer.create({
        data: {
          name: dto.name,
          shortName: dto.shortName ?? null,
        },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Заказчик с таким именем уже существует',
        defaultMessage: 'Ошибка при создании заказчика',
      });
    }
  }

  /** Получение заказчика по ID */
  async getById(id: string) {
    const customer = await this.prismaService.customer.findUnique({
      where: { id },
    });

    if (!customer) throw new NotFoundException('Заказчик не найден');
    return customer;
  }

  /** Обновление заказчика */
  async update(id: string, dto: UpdateCustomerDto) {
    await this.getById(id);

    try {
      return await this.prismaService.customer.update({
        where: { id },
        data: {
          name: dto.name,
          shortName: dto.shortName ?? null,
        },
      });
    } catch (error) {
      handlePrismaError(error, {
        conflictMessage: 'Обновление нарушает уникальность заказчика',
        defaultMessage: 'Ошибка при обновлении заказчика',
      });
    }
  }

  /** Удаление заказчика */
  async delete(id: string) {
    await this.getById(id);

    try {
      await this.prismaService.customer.delete({ where: { id } });
      return true;
    } catch (error) {
      handlePrismaError(error, {
        defaultMessage: 'Ошибка при удалении заказчика',
      });
    }
  }

  /** Получить всех заказчиков */
  async getAll() {
    return await this.prismaService.customer.findMany({
      orderBy: { name: 'asc' },
      include: { objects: true },
    });
  }
}
