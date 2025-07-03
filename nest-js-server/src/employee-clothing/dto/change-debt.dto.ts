import { IsNotEmpty, IsNumber } from 'class-validator';

export class ChangeDebtDto {
  @IsNumber()
  @IsNotEmpty()
  debt: number;
}
