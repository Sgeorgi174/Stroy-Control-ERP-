import type { ClothesType } from "./clothes";
import type { Season } from "./season";
import type { User } from "./user";

export type RequestStatus =
  | "CREATED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CLOSED";

export interface ClothesRequest {
  id: string;
  title: string;
  number: number;
  customer: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;

  createdBy: User;
  clothes?: RequestClothes[];
  comments?: RequestComment[];

  participants: User[];
  notifyUsers: User[];
}

export interface RequestClothes {
  id: string;
  type: ClothesType;
  season: Season;
  name: string;
  quantity: number;
  transferredQuantity: number;

  clothingSizeId?: string | null;
  clothingHeightId?: string | null;
  footwearSizeId?: string | null;
}

export interface RequestComment {
  id: string;
  text: string;
  createdAt: string;
  createdBy: User;
  userId: string;

  request: ClothesRequest;
  requestId: string;

  isSystemComment: boolean;
}
