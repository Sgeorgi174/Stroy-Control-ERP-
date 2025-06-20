// shared/dto/clothes.dto.ts

export type CreateClothesDto = {
  name: string;
  size: string;
  quantity: number;
  objectId: string;
};

export type UpdateClothesDto = Partial<CreateClothesDto>;

export type TransferClothesDto = {
  toObjectId: string;
  quantity: number;
};

export type ConfirmClothesTransferDto = {
  isConfirmed: boolean;
};

export type AddClothesDto = {
  quantity: number;
};

export type WriteOffClothesDto = {
  quantity: number;
  reason: string;
};

export type GiveClothingDto = {
  employeeId: string;
  quantity: number;
};
