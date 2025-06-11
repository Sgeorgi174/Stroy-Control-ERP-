export type Object = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  address: string;
  userId: null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  employees: number;
};
