import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Телефон должен быть строкой.' })
  @IsNotEmpty({ message: 'Телефон должен быть указан обязательно.' })
  phone: string;
}
