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
  clothingHeight: ClothingHeight;
  clothingSize: ClosthingSize;
  footwearSize: FootwearSize;
  provider: { id: string; name: string };
  price: number;
  quantity: number;
  inTransit: PendingClothesTransfer[];
  objectId: string;
  storage: Object;
  partNumber: string;
};

export type ClothingHeight = {
  id: string;
  height: string;
};

export type ClosthingSize = {
  id: string;
  size: string;
};

export type FootwearSize = {
  id: string;
  size: string;
};
