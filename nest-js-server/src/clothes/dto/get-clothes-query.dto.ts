import {
  IsOptional,
  IsEnum,
  IsUUID,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { ClothesType, Season } from 'generated/prisma';

export class GetClothesQueryDto {
  @IsOptional()
  @IsUUID()
  objectId?: string;

  @IsOptional()
  @IsEnum(Season)
  season?: Season;

  @IsNotEmpty()
  @IsEnum(ClothesType)
  type: ClothesType;

  @IsOptional()
  @IsString()
  size?: string;
}
