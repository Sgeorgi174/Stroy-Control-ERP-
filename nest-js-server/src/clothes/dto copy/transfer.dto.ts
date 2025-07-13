import { IsInt, IsUUID, Min } from 'class-validator';

export class TransferDto {
  @IsUUID()
  toObjectId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
