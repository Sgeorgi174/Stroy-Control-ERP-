import { IsNotEmpty, IsString } from 'class-validator';

export class RetransferDeviceDto {
  @IsNotEmpty()
  @IsString()
  toObjectId: string;
}
