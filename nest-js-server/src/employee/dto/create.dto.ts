import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsPhoneNumber,
} from 'class-validator';
import { Position } from 'generated/prisma';

export class CreateDto {
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя обязательно для заполнения' })
  firstName: string;

  @IsString({ message: 'Фамилия должна быть строкой' })
  @IsNotEmpty({ message: 'Фамилия обязательна для заполнения' })
  lastName: string;

  @IsString({ message: 'Отчество должно быть строкой' })
  @IsOptional()
  fatherName?: string;

  @IsString({ message: 'Телефон должен быть строкой' })
  @IsNotEmpty({ message: 'Телефон обязателен для заполнения' })
  @IsPhoneNumber('RU', { message: 'Некорректный формат телефона' })
  phoneNumber: string;

  @IsInt({ message: 'Размер одежды должен быть целым числом' })
  @Min(0, { message: 'Размер одежды не может быть отрицательным' })
  @IsNotEmpty({ message: 'Размер одежды обязателен для заполнения' })
  clothingSize: number;

  @IsInt({ message: 'Размер обуви должен быть целым числом' })
  @Min(0, { message: 'Размер обуви не может быть отрицательным' })
  @IsNotEmpty({ message: 'Размер обуви обязателен для заполнения' })
  footwearSize: number;

  @IsInt({ message: 'Остаток долга должен быть целым числом' })
  @Min(0, { message: 'Долг не может быть отрицательным' })
  @IsOptional()
  debt?: number;

  @IsEnum(Position, {
    message: `Должность должна быть одним из: ${Object.values(Position).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Должность должна быть указана' })
  position: Position;

  @IsString({ message: 'ID объекта должен быть строкой' })
  @IsOptional()
  objectId?: string;
}
