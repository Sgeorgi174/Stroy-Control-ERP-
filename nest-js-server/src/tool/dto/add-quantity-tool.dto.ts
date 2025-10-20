import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AddQuantityToolDto {
  @IsInt({ message: 'Количество должно быть целым числом' })
  @Min(1, { message: 'Количество должно быть не меньше 1' })
  @IsNotEmpty()
  quantity: number;
}
