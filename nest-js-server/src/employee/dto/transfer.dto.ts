import { IsNotEmpty, IsUUID } from 'class-validator';

export class TransferEmployeeDto {
  @IsNotEmpty()
  @IsUUID()
  objectId?: string;
}
