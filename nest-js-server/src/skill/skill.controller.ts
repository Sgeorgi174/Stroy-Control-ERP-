import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'generated/prisma';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('all')
  async getAll() {
    return await this.skillService.getAll();
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Post('create')
  async create(@Body() dto: CreateSkillDto) {
    return await this.skillService.create(dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateSkillDto) {
    return await this.skillService.update(id, dto);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.skillService.delete(id);
  }
}
