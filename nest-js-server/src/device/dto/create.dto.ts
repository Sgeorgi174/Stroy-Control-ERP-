import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DeviceStatus } from '@prisma/client';

export class CreateDto {
  @IsString({ message: 'Название устройства должно быть строкой' })
  @IsNotEmpty({ message: 'Название устройства обязательно для заполнения.' })
  name: string;

  @IsEnum(DeviceStatus, {
    message: `Статус должен быть одним из: ${Object.values(DeviceStatus).join(', ')}`,
  })
  @IsOptional()
  status?: DeviceStatus;

  @IsString({ message: 'Серийный номер должен быть строкой' })
  @IsNotEmpty({ message: 'Серийный номер обязателен для заполнения.' })
  serialNumber: string;

  @IsString({ message: 'object_id должен быть строкой' })
  @IsOptional()
  objectId?: string;

  @IsString()
  @IsOptional()
  originalSerial?: string;

  @IsString({ message: 'Ссылка должна быть строкой' })
  @IsOptional()
  marketUrl?: string;
}
