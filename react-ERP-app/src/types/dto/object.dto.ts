// types/dto/object.ts
export type CreateObjectDto = {
  name: string;
  address: string;
  userId?: string | null;
  customerId: string;
};

export type UpdateObjectDto = {
  name: string;
  address: string;
  userId?: string | null;
  customerId: string;
};

export type ChangeForemanDto = {
  userId?: string | null;
};

export type CreateCustomerDto = {
  name: string;
  shortName?: string | null;
};

export type UpdateCustomerDto = {
  name: string;
  shortName?: string | null;
};
