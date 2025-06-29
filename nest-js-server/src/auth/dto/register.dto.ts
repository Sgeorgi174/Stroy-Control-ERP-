import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { Roles } from 'generated/prisma';

export class RegisterDto {
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
