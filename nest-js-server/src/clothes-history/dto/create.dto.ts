import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CreateDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  clothesId: string;

  @IsUUID()
  @IsNotEmpty()
  fromObjectId: string;

  @IsUUID()
  @IsNotEmpty()
  toObjectId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
