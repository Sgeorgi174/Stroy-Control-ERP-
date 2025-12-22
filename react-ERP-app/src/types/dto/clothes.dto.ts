import type { ClothesType, Seasons } from "../clothes";
import type { Season } from "../season";

export interface CreateClothesDto {
  name: string;
  season: Seasons;
  quantity: number;
  clothingSizeId: string | undefined;
  footwearSizeId: string | undefined;
  clothingHeightId: string | undefined;
  providerId: string;
  type: ClothesType;
  objectId: string;
  price: number;
}

export interface UpdateClothesDto {
  name: string;
  season: Seasons;
  quantity: number;
  clothingSizeId: string | undefined;
  footwearSizeId: string | undefined;
  clothingHeightId: string | undefined;
  providerId: string;
  type: ClothesType;
  objectId: string;
  price: number;
}

export interface TransferClothesDto {
  toObjectId: string;
  quantity: number;
}

export interface ConfirmTransferClothesDto {
  quantity: number;
}

export interface WriteOffClothesDto {
  quantity: number;
  writeOffComment: string;
}

export interface AddClothesDto {
  quantity: number;
}

export interface GiveClothingDto {
  employeeId: string;
}

export interface ReturnFromEmployeeDto {
  employeeId: string;
  objectId: string;
  clothesId: string;
  employeeClothingId: string;
}

export interface RejectClotheseDto {
  rejectionComment: string;
}

export interface ResendClothesTransferDto {
  toObjectId: string;
}

export interface WirteOffClothesInTransferDto {
  comment: string;
}

export interface CancelClothesTransferDto {
  rejectionComment: string;
}

export interface IssueCustomClothesDto {
  name: string;

  size: string;

  heigh?: string;

  price: number;

  type: ClothesType;

  season: Season;
}
