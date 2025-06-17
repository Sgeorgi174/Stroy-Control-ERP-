import { IsEnum, IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { ClothesActions } from 'generated/prisma';

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

  @IsEnum(ClothesActions, {
    message: `Тип должен быть одним из: ${Object.values(ClothesActions).join(', ')}`,
  })
  @IsNotEmpty({
    message: 'тип action должен быть указан',
  })
  action: ClothesActions;
}
