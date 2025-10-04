import { IsNotEmpty, IsString } from 'class-validator';

export class AddSizeForFootwearDto {
  @IsString()
  @IsNotEmpty()
  size: string;
}
