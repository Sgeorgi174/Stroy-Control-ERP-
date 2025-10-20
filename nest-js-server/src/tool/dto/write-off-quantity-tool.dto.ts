// dto/write-off-quantity.dto.ts
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class WriteOffQuantityDto {
  @IsInt({ message: 'Количество должно быть целым числом' })
  @Min(1, { message: 'Количество должно быть не меньше 1' })
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  comment: string;
}
