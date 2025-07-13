import { IsInt, Min } from 'class-validator';

export class AddDto {
  @IsInt()
  @Min(1)
  quantity: number;
}
