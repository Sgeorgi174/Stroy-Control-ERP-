import { IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';

export enum Role {
  OWNER = 'OWNER',
  MASTER = 'MASTER',
  ACCOUNTANT = 'ACCOUNTANT',
  FOREMAN = 'FOREMAN',
}

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

  @IsEnum(Role, {
    message: `Роль должна быть одной из: ${Object.values(Role).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Роль должна быть указана обязательно.' })
  role: Role;
}
