import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ClothesHistoryService } from './clothes-history.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'generated/prisma';

@Controller('clothes-history')
export class ClothesHistoryController {
  constructor(private readonly clothesHistoryService: ClothesHistoryService) {}

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('transfers/:id')
  async getByClothesId(@Param('id') id: string) {
    return this.clothesHistoryService.getByClothesId(id);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.clothesHistoryService.delete(id);
  }
}
