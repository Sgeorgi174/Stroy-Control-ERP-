import type { Object } from "./object";
import type { PendingClothesTransfer } from "./transfers";

export type ClothesType = "CLOTHING" | "FOOTWEAR";
export type Seasons = "SUMMER" | "WINTER";

export type Clothes = {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: ClothesType;
  season: Seasons;
  name: string;
  size: number;
  price: number;
  quantity: number;
  inTransit: PendingClothesTransfer[];
  objectId: string;
  storage: Object;
};
