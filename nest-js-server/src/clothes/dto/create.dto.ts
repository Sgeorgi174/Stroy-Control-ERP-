import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { ClothesType, Season } from 'generated/prisma';

export class CreateDto {
  @IsString({ message: 'Название одежды или обуви должно быть строкой' })
  @IsNotEmpty({
    message: 'Название одежды или обуви обязательно для заполнения.',
  })
  name: string;

  @IsInt({ message: 'Размер должен быть целым числом' })
  @IsPositive({ message: 'Размер не может быть отрицательным' })
  @IsNotEmpty({ message: 'Размер обязателен для заполнения' })
  size: number;

  @IsInt({ message: 'Цена должна быть целым числом' })
  @IsPositive({ message: 'Цена не может быть отрицательной' })
  @IsNotEmpty({ message: 'Цена обязательна для заполнения' })
  price: number;

  @IsInt({ message: 'Количество должно быть целым числом' })
  @IsPositive({ message: 'Количество не может быть отрицательным' })
  @IsNotEmpty({ message: 'Количество обязательно для заполнения' })
  quantity: number;

  @IsInt({ message: 'Количество в пути должно быть целым числом' })
  @Min(0)
  @IsNotEmpty({ message: 'Количество в пути обязательно для заполнения' })
  inTransit: number;

  @IsEnum(ClothesType, {
    message: `Тип должен быть одним из: ${Object.values(ClothesType).join(', ')}`,
  })
  @IsNotEmpty({
    message: 'Тип одежды или обуви должен быть указан обязательно',
  })
  type: ClothesType;

  @IsEnum(Season, {
    message: `Сезон должен быть одним из: ${Object.values(Season).join(', ')}`,
  })
  @IsNotEmpty({
    message: 'Сезон должен быть указан обязательно',
  })
  season: Season;

  @IsString({ message: 'object_id должен быть строкой' })
  @IsNotEmpty({ message: 'object_id обязателен для заполнения.' })
  objectId: string;
}
