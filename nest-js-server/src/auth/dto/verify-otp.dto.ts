import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString({ message: 'Телефон должен быть строкой.' })
  @IsNotEmpty({ message: 'Телефон должен быть указан обязательно.' })
  phone: string;

  @IsNumber({}, { message: 'OTP должен быть числом' })
  @IsNotEmpty({ message: 'Телефон должен быть указан обязательно.' })
  otp: number;
}
