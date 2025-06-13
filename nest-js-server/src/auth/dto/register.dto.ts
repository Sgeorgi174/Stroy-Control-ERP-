import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Roles } from 'generated/prisma';

export class RegisterDto {
  @IsString({ message: 'Логин должен быть строкой.' })
  @IsNotEmpty({ message: 'Логин обязателен для заполнения.' })
  login: string;

  @IsString({ message: 'Пароль должен быть строкой.' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения.' })
  @MinLength(6, {
    message: 'Пароль должен содержать минимум 6 символов.',
  })
  password: string;

  @IsString({ message: 'Имя должно быть строкой.' })
  @IsNotEmpty({ message: 'Имя должно быть указано обязательно.' })
  firstName: string;

  @IsString({ message: 'Фамилия должна быть строкой.' })
  @IsNotEmpty({ message: 'Фамилия должна быть указана обязательно.' })
  lastName: string;

  @IsString({ message: 'Телефон должен быть строкой.' })
  @IsNotEmpty({ message: 'Телефон должен быть указан обязательно.' })
  phone: string;

  @IsEnum(Roles, {
    message: `Роль должна быть одной из: ${Object.values(Roles).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Роль должна быть указана обязательно.' })
  role: Roles;

  @IsString({ message: 'Id объекта должен быть строкой.' })
  @IsOptional()
  objectId?: string;
}
