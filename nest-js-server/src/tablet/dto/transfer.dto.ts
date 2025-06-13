import { IsNotEmpty, IsUUID } from 'class-validator';

export class TransferTabletDto {
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;
}
