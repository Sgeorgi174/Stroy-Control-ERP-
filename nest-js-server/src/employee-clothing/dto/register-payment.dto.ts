import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class RegisterPaymentDto {
  @IsInt()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsUUID()
  shiftId?: string;
}
