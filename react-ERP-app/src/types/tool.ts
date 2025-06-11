export type Tool = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  status: string;
  serialNumber: string;
  objectId: string;
  storage: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
};
