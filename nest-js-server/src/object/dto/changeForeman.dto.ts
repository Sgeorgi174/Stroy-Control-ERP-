import { IsOptional, IsString } from 'class-validator';

export class ChangeForemanDto {
  @IsOptional()
  @IsString()
  userId?: string;
}
