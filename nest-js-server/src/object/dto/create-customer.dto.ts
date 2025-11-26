import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString({ message: 'Адрес объекта должен быть строкой' })
  @IsOptional({ message: 'Адрес объекта обязателен для заполнения.' })
  shortName?: string;
}
