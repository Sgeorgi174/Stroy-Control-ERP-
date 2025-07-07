import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class WriteOffDto {
  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  writeOffComment: string;
}
