import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDocumentDto } from './dto/add-document.dto';

@Injectable()
export class EmployeeDocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  private validateDocumentDate(data: Partial<CreateEmployeeDocumentDto>) {
    // String(true) -> "true", String("true") -> "true"
    const isIndefinite = String(data.isIndefinite) === 'true';

    if (!isIndefinite && !data.expDate) {
      throw new BadRequestException(
        'Необходимо указать срок действия или отметить документ как бессрочный',
      );
    }
  }

  async create(employeeId: string, data: CreateEmployeeDocumentDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Сотрудник не найден');
    }

    this.validateDocumentDate(data);

    return this.prisma.employeeDocument.create({
      data: {
        name: data.name,
        docSrc: data.docSrc || '',
        isIndefinite: data.isIndefinite ?? false,
        expDate: data.isIndefinite ? null : data.expDate,
        comment: data.comment, // <-- Добавили сохранение комментария
        employeeId,
      },
    });
  }

  async update(id: string, data: Partial<CreateEmployeeDocumentDto>) {
    const document = await this.prisma.employeeDocument.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Документ не найден');
    }

    if (data.isIndefinite !== undefined || data.expDate !== undefined) {
      this.validateDocumentDate(data as CreateEmployeeDocumentDto);
    }

    return this.prisma.employeeDocument.update({
      where: { id },
      data: {
        name: data.name,
        isIndefinite: data.isIndefinite,
        expDate: data.isIndefinite ? null : data.expDate,
        comment: data.comment, // <-- Добавили обновление комментария
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

  async updateComment(id: string, comment: string) {
    const document = await this.prisma.employeeDocument.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Документ не найден');
    }

    return this.prisma.employeeDocument.update({
      where: { id },
      data: { comment },
    });
  }

  // Удалить комментарий (установить null)
  async deleteComment(id: string) {
    const document = await this.prisma.employeeDocument.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Документ не найден');
    }

    return this.prisma.employeeDocument.update({
      where: { id },
      data: { comment: null },
    });
  }
}
