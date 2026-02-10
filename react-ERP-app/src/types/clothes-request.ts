import type { User } from "./user";

export type RequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CLOSED";

export interface ClothesRequest {
  id: string;
  title: string;
  customer: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;

  createdBy: User;
  clothes?: RequestClothes;

  participants: User[];
  notifyUsers: User[];
}

export interface RequestClothes {
  id: string;
  type: string;
  season: string;
  name: string;
  quantity: number;

  clothingSizeId?: string | null;
  clothingHeightId?: string | null;
  footwearSizeId?: string | null;
}
