import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
  IsArray,
} from 'class-validator';
import { Countries } from 'generated/prisma';

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
  clothingSizeId?: string;

  @IsString()
  @IsOptional({ message: 'Размер обязателен для заполнения' })
  clothingHeightId?: string;

  @IsString()
  @IsOptional({ message: 'Размер обязателен для заполнения' })
  footwearSizeId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Должность должна быть указана' })
  position: string;

  @IsString()
  @IsNotEmpty()
  dob: string;

  @IsString()
  @IsNotEmpty()
  startWorkDate: string;

  @IsString({ message: 'ID объекта должен быть строкой' })
  @IsOptional()
  objectId?: string;

  @IsArray()
  @IsOptional()
  skillIds?: string[];

  @IsEnum(Countries, {
    message: `Страна должна быть одним из: ${Object.values(Countries).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Страна должна быть указана' })
  country: Countries;

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
