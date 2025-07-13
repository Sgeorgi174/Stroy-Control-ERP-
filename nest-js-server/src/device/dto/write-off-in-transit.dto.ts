import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DeviceStatus } from 'generated/prisma';

export class WriteOffDeviceInTransferDto {
  @IsEnum(DeviceStatus, {
    message: `Статус должен быть одним из: ${Object.values(DeviceStatus).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Новый статус обязателен' })
  status: DeviceStatus;

  @IsNotEmpty({ message: 'Коментарий обязателен' })
  @IsString()
  comment: string;
}
