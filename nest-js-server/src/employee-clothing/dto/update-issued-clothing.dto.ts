import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateIssuedClothingDto {
  @IsString()
  priceWhenIssued: string;

  @IsString()
  debtAmount: string;

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
