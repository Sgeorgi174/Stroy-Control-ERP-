import type { Object } from "./object";

export type Employee = {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  phoneNumber: string;
  clothingSize: number;
  footwearSize: number;
  position: "FOREMAN" | "ELECTRICAN" | "LABORER";
  workPlace: Object; // Миасс
};
