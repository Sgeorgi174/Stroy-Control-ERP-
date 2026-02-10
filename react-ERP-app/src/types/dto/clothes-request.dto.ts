// types/dto/clothes-request.dto.ts

import type { RequestStatus } from "../clothes-request";

export interface CreateClothesRequestDto {
  title: string;
  customer: string;
  status?: RequestStatus;

  clothes?: {
    type: string;
    season: string;
    name: string;
    quantity: number;

    clothingSizeId?: string;
    clothingHeightId?: string;
    footwearSizeId?: string;
  };

  participantsIds?: string[];
  notifyUsersIds?: string[];
}

export type UpdateClothesRequestDto = Partial<CreateClothesRequestDto>;
