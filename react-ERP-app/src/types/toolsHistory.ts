export type ToolHistory = {
  id: string;
  createdAt: string;
  updatedAt: string;
  toolId: string;
  userId: string;
  quantity: number;
  fromObjectId: string;
  toObjectId: string;
  fromObject: {
    name: string;
  };
  toObject: {
    name: string;
  };
  movedBy: {
    firstName: string;
    lastName: string;
  };
};
