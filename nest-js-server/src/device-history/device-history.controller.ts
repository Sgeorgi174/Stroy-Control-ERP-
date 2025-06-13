import { Controller, Delete, Get, Param } from '@nestjs/common';
import { Roles } from 'generated/prisma';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { DeviceHistoryService } from './device-history.service';

@Controller('device-history')
export class DeviceHistoryController {
  constructor(private readonly deviceHistoryService: DeviceHistoryService) {}

  @Authorization(Roles.OWNER)
  @Get('by-id/:id')
  async getByDeviceId(@Param('id') id: string) {
    return this.deviceHistoryService.getByToolId(id);
  }

  @Authorization(Roles.OWNER)
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.deviceHistoryService.delete(id);
  }
}
