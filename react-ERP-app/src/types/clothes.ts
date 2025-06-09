// types/clothes.ts
export type Clothes = {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: "CLOTHING" | "FOOTWEAR";
  season: "SUMMER" | "WINTER";
  name: string;
  size: number;
  price: number;
  quantity: number;
  inTransit: number;
  objectId: string;
  storage: {
    id: string;
    name: string;
  };
};
