import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class TransferDto {
  @IsUUID()
  @IsNotEmpty()
  objectId: string;

  @IsNumber()
  @IsOptional()
  quantity: number;
}
