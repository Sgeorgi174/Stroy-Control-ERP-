import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
  IsArray,
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

  @IsString()
  @IsOptional({ message: 'Размер обязателен для заполнения' })
  closthingSizeId?: string;

  @IsString()
  @IsOptional({ message: 'Размер обязателен для заполнения' })
  closthingHeightId?: string;

  @IsString()
  @IsOptional({ message: 'Размер обязателен для заполнения' })
  footwearSizeId?: string;

  @IsEnum(Position, {
    message: `Должность должна быть одним из: ${Object.values(Position).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Должность должна быть указана' })
  position: Position;

  @IsString({ message: 'ID объекта должен быть строкой' })
  @IsOptional()
  objectId?: string;

  @IsArray()
  skillIds?: string[];

  @IsString()
  @IsNotEmpty()
  passportSerial: string;

  @IsString()
  @IsNotEmpty()
  passportNumber: string;

  @IsString()
  @IsNotEmpty()
  whereIssued: string;

  @IsString()
  @IsNotEmpty()
  issueDate: string;

  @IsString()
  @IsNotEmpty()
  registrationRegion: string;

  @IsString()
  @IsNotEmpty()
  registrationCity: string;

  @IsString()
  @IsNotEmpty()
  registrationStreet: string;

  @IsString()
  @IsNotEmpty()
  registrationBuild: string;

  @IsString()
  @IsOptional()
  registrationFlat: string;
}
