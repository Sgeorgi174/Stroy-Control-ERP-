import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeeDocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    employeeId: string,
    data: {
      name: string;
      expDate: string;
      docSrc: string;
    },
  ) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Сотрудник не найден');
    }

    return this.prisma.employeeDocument.create({
      data: {
        name: data.name,
        expDate: data.expDate,
        docSrc: data.docSrc,
        employeeId,
      },
    });
  }

  async findAll(employeeId: string) {
    return this.prisma.employeeDocument.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string) {
    return this.prisma.employeeDocument.delete({
      where: { id },
    });
  }
}
