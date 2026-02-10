import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RequestStatus, ClothesType, Season } from '@prisma/client';

class CreateRequestClothesDto {
  @IsEnum(ClothesType)
  type: ClothesType;

  @IsEnum(Season)
  season: Season;

  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  clothingSizeId?: string;

  @IsOptional()
  @IsUUID()
  clothingHeightId?: string;

  @IsOptional()
  @IsUUID()
  footwearSizeId?: string;

  @IsInt()
  quantity: number;
}

export class CreateClothesRequestDto {
  @IsString()
  title: string;

  @IsString()
  customer: string;

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRequestClothesDto)
  clothes?: CreateRequestClothesDto;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  participantsIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  notifyUsersIds?: string[];
}
