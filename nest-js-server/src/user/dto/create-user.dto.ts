import { Roles } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
