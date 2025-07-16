import type { ClothesType, Seasons } from "../clothes";

export interface CreateClothesDto {
  name: string;
  season: Seasons;
  quantity: number;
  size: number;
  type: ClothesType;
  objectId: string;
  price: number;
}

export interface UpdateClothesDto {
  name: string;
  season: Seasons;
  quantity: number;
  size: number;
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
