import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class ToolService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: CreateDto) {
    try {
      return await this.prismaService.tool.create({
        data: {
          name: dto.name,
          serialNumber: dto.serialNumber,
          objectId: dto.objectId,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ConflictException(
          'Инструмент с таким серийным номером уже существует',
        );

      throw new InternalServerErrorException(
        'Ошибка создания нового инструмента',
      );
    }
  }

  public async getById() {}

  public async getAll() {}

  public async update() {}

  public async delete() {}
}
