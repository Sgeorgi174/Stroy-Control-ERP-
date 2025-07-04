import { Controller, Delete, Get, Param } from '@nestjs/common';
import { Roles } from 'generated/prisma';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { DeviceHistoryService } from './device-history.service';

@Controller('device-history')
export class DeviceHistoryController {
  constructor(private readonly deviceHistoryService: DeviceHistoryService) {}

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('transfers/:id')
  async getTransfersByDeviceId(@Param('id') id: string) {
    return this.deviceHistoryService.getTransfersByDeviceId(id);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Get('statuses/:id')
  async getStatusChangesByDeviceId(@Param('id') id: string) {
    return this.deviceHistoryService.getStatusChangesByDeviceId(id);
  }

  @Authorization(Roles.OWNER, Roles.FOREMAN)
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.deviceHistoryService.delete(id);
  }
}
