import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  deviceId: string;

  @IsUUID()
  @IsNotEmpty()
  fromObjectId: string;

  @IsUUID()
  @IsNotEmpty()
  toObjectId: string;
}
