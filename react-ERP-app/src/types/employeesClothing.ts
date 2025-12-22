import type { Clothes, ClothesType } from "./clothes";
import type { Season } from "./season";

export type EmployeeClothing = {
  totalDebt: number;
  items: EmployeeClothingItem[];
};

export type EmployeeClothingItem = {
  id: string;
  employeeId: string;
  clothingId: string;
  issuedAt: string; // исправлено
  priceWhenIssued: number;
  debtAmount: string;
  isReturned: boolean;
  clothing: Clothes;
  customClothes: {
    id: string;
    name: string;
    size: string;
    height: string;
    price: number;
    season: Season;
    clothesType: ClothesType;
  };
};

export interface UpdateIssuedClothingDto {
  priceWhenIssued: number;
  debtAmount: string;
  issuedAt: string;
  clothingSizeId?: string | null;
  clothingHeightId?: string | null;
  footwearSizeId?: string | null;
}
