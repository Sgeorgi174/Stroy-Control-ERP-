import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ToolHistoryService } from './tool-history.service';
import { Roles } from 'generated/prisma';
import { Authorization } from 'src/auth/decorators/auth.decorator';

@Controller('tool-history')
export class ToolHistoryController {
  constructor(private readonly toolHistoryService: ToolHistoryService) {}

  @Authorization(Roles.OWNER)
  @Get('transfers/:id')
  async getTransferByToolId(@Param('id') id: string) {
    return this.toolHistoryService.getTransfersByToolId(id);
  }

  @Authorization(Roles.OWNER)
  @Get('statuses/:id')
  async getStatusChangesByToolId(@Param('id') id: string) {
    return this.toolHistoryService.getStatusChangesByToolId(id);
  }

  @Authorization(Roles.OWNER)
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.toolHistoryService.delete(id);
  }
}
