import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DeviceStatus } from 'generated/prisma';

export class UpdateStatusDto {
  @IsEnum(DeviceStatus, {
    message: `Статус должен быть одним из: ${Object.values(DeviceStatus).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Новый статус обязателен' })
  newStatus: DeviceStatus;

  @IsNotEmpty({ message: 'Комментарий обязателен' })
  @IsString()
  comment: string;
}
