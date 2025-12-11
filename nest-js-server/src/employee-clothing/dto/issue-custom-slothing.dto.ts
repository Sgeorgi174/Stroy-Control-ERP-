import { ClothesType, Season } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class IssueCustomClothingDto {
  @IsString({ message: 'Название одежды или обуви должно быть строкой' })
  @IsNotEmpty({
    message: 'Название одежды или обуви обязательно для заполнения.',
  })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Размер обязателен для заполнения' })
  size: string;

  @IsString()
  @IsOptional()
  heigh?: string;

  @IsInt({ message: 'Цена должна быть целым числом' })
  @IsPositive({ message: 'Цена не может быть отрицательной' })
  @IsNotEmpty({ message: 'Цена обязательна для заполнения' })
  price: number;

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
}
