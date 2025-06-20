import type { Object } from "./object";

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
  inTransit: number;
  objectId: string;
  storage: Object;
};
