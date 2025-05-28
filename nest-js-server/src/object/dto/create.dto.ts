import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDto {
  @IsString({ message: 'Название объекта должно быть строкой' })
  @IsNotEmpty({ message: 'Название объекта обязательно для заполнения.' })
  name: string;

  @IsString({ message: 'Адрес объекта должен быть строкой' })
  @IsNotEmpty({ message: 'Адрес объекта обязателен для заполнения.' })
  address: string;

  @IsOptional()
  @IsString({ message: 'user_Id должен быть строкой' })
  userId?: string;
}
