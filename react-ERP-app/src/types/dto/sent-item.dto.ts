export interface CreateSentItemDto {
  name: string;

  quantity: number;

  price: number;

  description: string;

  addedDay: string;

  additionalStorageId: string;
}

export interface UpdateSentItemDto {
  name: string;

  price: number;

  decsription: string;
}

export interface ChangeSentItemQuantityDto {
  quantity: number;

  comment: string;

  actionDate: string;
}
