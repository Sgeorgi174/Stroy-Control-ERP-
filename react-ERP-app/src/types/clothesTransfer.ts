import type { Clothes } from "./clothes";
import type { Object } from "./object";

export type ClothesTransfer = {
  clothesId: string;
  createdAt: string;
  fromObjectId: string;
  id: string;
  quantity: number;
  toObjectId: string;
  clothes: Clothes;
  toObject: Object;
};
