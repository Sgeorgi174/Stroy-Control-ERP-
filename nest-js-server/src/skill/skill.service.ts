import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { handlePrismaError } from 'src/libs/common/utils/prisma-error.util';

@Injectable()
export class SkillService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: CreateSkillDto) {
    try {
      return await this.prismaService.skill.create({
        data: dto,
      });
    } catch (err) {
      handlePrismaError(err, {
        conflictMessage: 'Навык с таким названием уже существует',
        defaultMessage: 'Ошибка создания нового навыка',
      });
    }
  }

  public async update(skillId: string, dto: UpdateSkillDto) {
    try {
      return await this.prismaService.skill.update({
        where: { id: skillId },
        data: dto,
      });
    } catch (err) {
      handlePrismaError(err, {
        notFoundMessage: 'Навык не найден',
        defaultMessage: 'Ошибка обновления навыка',
      });
    }
  }

  public async delete(skillId: string) {
    try {
      await this.prismaService.skill.delete({ where: { id: skillId } });
      return true;
    } catch (err) {
      handlePrismaError(err, {
        notFoundMessage: 'Навык не найден',
        defaultMessage: 'Ошибка удаления навыка',
      });
    }
  }

  public async getAll() {
    return await this.prismaService.skill.findMany({
      select: { skill: true, id: true },
    });
  }
}
