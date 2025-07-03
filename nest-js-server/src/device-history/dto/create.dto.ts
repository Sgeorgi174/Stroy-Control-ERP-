import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { DeviceActions } from 'generated/prisma';

export class CreateDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  deviceId: string;

  @IsUUID()
  @IsOptional()
  fromObjectId?: string;

  @IsUUID()
  @IsNotEmpty()
  toObjectId: string;

  @IsEnum(DeviceActions)
  @IsNotEmpty()
  action: DeviceActions;
}
