import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CreateDto {
  // Заметьте: исправлено на CreateDto (с большой буквы)
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
