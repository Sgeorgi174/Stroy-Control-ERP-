// types/dto/clothes-request.dto.ts

import type { ClothesType } from "../clothes";
import type { RequestStatus } from "../clothes-request";
import type { Season } from "../season";

export interface CreateClothesRequestDto {
  title: string;
  customer: string;
  status?: RequestStatus;

  clothes?: {
    type: ClothesType;
    season: Season;
    name: string;
    quantity: number;

    clothingSizeId?: string;
    clothingHeightId?: string;
    footwearSizeId?: string;
  }[];

  participantsIds?: string[];
  notifyUsersIds?: string[];
}

export type UpdateClothesRequestDto = Partial<CreateClothesRequestDto>;

export interface UpdateRequestStatusDto {
  status: RequestStatus; // Или используй Enum из Prisma, если прокидываешь типы
  text?: string;
}
