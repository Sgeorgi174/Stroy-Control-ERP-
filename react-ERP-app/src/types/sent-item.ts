import type { AdditionalStorage } from "./additional-storage";

export type SentItem = {
  id: string;
  createdAt: string;
  addedDay: string;
  name: string;
  quantity: number;
  price: number;
  desсription: string;
  additionalStorageId: string;
  storage: AdditionalStorage;
};

export type SentItemHistory = {
  id: string;
  createdAt: string;
  type: "ADD" | "REMOVE" | "CREATE";
  quantity: number;
  comment?: string;
  sentItemId: string;
  actionDate: string;
};
