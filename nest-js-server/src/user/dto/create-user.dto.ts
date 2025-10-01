import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Roles } from 'generated/prisma';

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
