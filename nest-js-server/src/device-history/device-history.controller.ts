import { Controller, Delete, Get, Param } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { DeviceHistoryService } from './device-history.service';

@Controller('device-history')
export class DeviceHistoryController {
  constructor(private readonly deviceHistoryService: DeviceHistoryService) {}

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
    Roles.FOREMAN,
  )
  @Get('transfers/:id')
  async getTransfersByDeviceId(@Param('id') id: string) {
    return this.deviceHistoryService.getTransfersByDeviceId(id);
  }

  @Authorization(
    Roles.MASTER,
    Roles.OWNER,
    Roles.ACCOUNTANT,
    Roles.ADMIN,
    Roles.ASSISTANT_MANAGER,
  )
  @Get('statuses/:id')
  async getStatusChangesByDeviceId(@Param('id') id: string) {
    return this.deviceHistoryService.getStatusChangesByDeviceId(id);
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
    return this.deviceHistoryService.delete(id);
  }
}
