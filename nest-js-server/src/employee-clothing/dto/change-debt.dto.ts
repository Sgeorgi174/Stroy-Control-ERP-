import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeDebtDto {
  @IsString()
  @IsNotEmpty()
  debt: string;
}
