import type { Clothes } from "./clothes";

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
  debtAmount: number;
  isReturned: boolean;
  clothing: Clothes;
};
