import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class ToolService {
  public constructor(private readonly prismaService: PrismaService) {}

  private async accessObject(id: string, userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { object: true },
    });
    if (!user) throw new NotFoundException('Юзер не найден');

    const tool = await this.prismaService.tool.findUnique({ where: { id } });

    if (!tool) throw new NotFoundException('Инструмент не найден');

    if (user.role === 'FOREMAN' && user.object?.id !== tool?.objectId)
      throw new ForbiddenException('Недостаточно прав для этого объекта');

    return { user, tool };
  }

  public async create(dto: CreateDto) {
    try {
      return await this.prismaService.tool.create({
        data: {
          name: dto.name,
          serialNumber: dto.serialNumber,
          objectId: dto.objectId,
        },
        include: { storage: true },
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

  public async getById(id: string) {
    const tool = await this.prismaService.tool.findUnique({
      where: { id },
      include: { storage: true },
    });

    if (!tool) throw new NotFoundException('Инструмент не найден');

    return tool;
  }

  public async getAll() {
    return await this.prismaService.tool.findMany({
      include: { storage: true },
    });
  }

  public async update(id: string, dto: UpdateDto) {
    try {
      return await this.prismaService.tool.update({
        where: { id },
        data: {
          name: dto.name,
          status: dto.status ?? 'ON_OBJECT',
          serialNumber: dto.serialNumber,
          objectId: dto.objectId,
        },
        include: { storage: true },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Сотрудник не найден');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Обновление нарушает уникальность данных');
      }
      throw new InternalServerErrorException('Не удалось обновить сотрудника');
    }
  }

  public async transfer(id: string, objectId: string, userId: string) {
    await this.accessObject(id, userId);
    try {
      return await this.prismaService.tool.update({
        where: { id },
        data: {
          objectId: objectId,
          status: 'IN_TRANSIT',
        },
        include: { storage: true },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Инструмент не найден');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Обновление нарушает уникальность данных');
      }

      throw new InternalServerErrorException('Не удалось обновить сотрудника');
    }
  }

  public async confirmTransfer(id: string) {
    try {
      const updatedTool = await this.prismaService.tool.update({
        where: { id },
        data: {
          status: 'ON_OBJECT',
        },
        include: { storage: true },
      });

      return updatedTool;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Инструмент не найден');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Обновление нарушает уникальность данных');
      }

      throw new InternalServerErrorException('Не удалось обновить сотрудника');
    }
  }

  public async delete(id: string) {
    await this.getById(id);

    await this.prismaService.tool.delete({ where: { id } });

    return true;
  }
}
