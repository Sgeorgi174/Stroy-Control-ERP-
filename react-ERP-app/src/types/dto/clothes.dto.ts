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
  objectId: string;
}

export interface WriteOffClothesDto {
  quantity: number;
}

export interface AddClothesDto {
  quantity: number;
}

export interface GiveClothingDto {
  employeeId: string;
}
