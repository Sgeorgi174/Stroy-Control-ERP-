import { IsNotEmpty, IsUUID } from 'class-validator';

export class TransferDto {
  @IsUUID()
  @IsNotEmpty()
  objectId: string;
}
