import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateIssuedClothingDto {
  @IsNumber()
  priceWhenIssued: number;

  @IsNumber()
  debtAmount: number;

  @IsDateString()
  issuedAt: string;

  @IsOptional()
  @IsString()
  clothingSizeId?: string | null;

  @IsOptional()
  @IsString()
  clothingHeightId?: string | null;

  @IsOptional()
  @IsString()
  footwearSizeId?: string | null;
}
