// types/dto/object.ts
export type CreateObjectDto = {
  name: string;
  address: string;
  userId?: string | null;
};

export type UpdateObjectDto = {
  name: string;
  address: string;
  userId?: string | null;
};

export type ChangeForemanDto = {
  userId?: string | null;
};
